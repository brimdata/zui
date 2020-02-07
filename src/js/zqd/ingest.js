/* @flow */
import fs from "fs"
import path from "path"
import os from "os"
import util from "util"
import {execFile, ChildProcess} from "child_process"
import {PassThrough} from "stream"
import EventEmitter from "events"
import {Timeout} from "timers"

const setTimeoutPromise = util.promisify(setTimeout)
const zqTimeoutDur = 4000

export class IngestProcess extends EventEmitter {
  zeek: ?ChildProcess
  zq: ?Promise<void>
  zqCancel: ?() => void
  tmpdir: string
  spacedir: string
  space: string
  pcaps: Array<string>
  timeout: Timeout

  constructor(spaceRoot: string, pcaps: Array<string>) {
    super()
    this.tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "pcapingest-"))
    let [spacedir, space] = createspace(spaceRoot)
    this.spacedir = spacedir
    this.space = space
    this.pcaps = pcaps
  }

  async start(): Promise<string> {
    this.zeek = await startZeek(this.tmpdir, this.pcaps)
    this.zeek.on("close", this.zeekExit)
    // do an initial zq slurp before returning
    await this.runZQ()
    // start zq update loop after zqTimeoutDur
    this.timeout = setTimeout(this.loop, zqTimeoutDur)
    return this.space
  }

  loop = async () => {
    await this.runZQ()
    this.timeout.refresh()
  }

  runZQ = async () => {
    if (this.zq) {
      await this.zq
    }
    let [zq, cancel] = startZQ(this.tmpdir, this.spacedir)
    this.setZQ(zq, cancel)
    await zq
    this.setZQ(null, null)
    this.emit("space_updated", {
      space: this.space,
      done: !this.zeek
    })
  }

  setZQ(zq: ?Promise<void>, cancel: ?() => void) {
    this.zq = zq
    this.zqCancel = cancel
  }

  zeekExit = async () => {
    let zeek = this.zeek
    this.zeek = undefined
    this.timeout.unref()
    if (this.zqCancel) {
      this.zqCancel()
    }
    // if zeek was killed no need to run zq return
    if (zeek && zeek.killed) {
      return
    }
    await this.runZQ()
    this.emit("complete")
  }

  kill() {
    this.zeek && this.zeek.kill()
    this.zqCancel && this.zqCancel()
  }
}

function startZeek(
  tmpdir: string,
  pcaps: Array<string>
): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const mergecap = execFile("mergecap", ["-w", "-", ...pcaps])
    const zeek = execFile("zeek", ["-r", "-"], {
      cwd: tmpdir,
      stdio: [mergecap.stdout, "pipe", "inherit"]
    })
    zeek.on("error", reject)
    // once merge cap has started sending data, resolve.
    mergecap.stdout.once("data", () => resolve(zeek))
  })
}

function startZQ(tmpdir: string, dst: string): [Promise<void>, () => void] {
  const query = "sort -limit 1000000000 ts"
  const files = logfiles(tmpdir)
  const args = ["-f", "bzng", query, ...files]
  const zq = execFile("zq", args)
  zq.stdout.pipe(fs.createWriteStream(path.join(dst, "all.bzng")))
  let p = new Promise((resolve, reject) => {
    zq.on("close", resolve)
    zq.on("error", reject)
  })
  return [p, zq.kill]
}

function createspace(dir: string): [string, string] {
  let spacedir = fs.mkdtempSync(path.join(dir, "untitled-"))
  let {name} = path.parse(spacedir)
  return [spacedir, name]
}

function logfiles(dir: string): Array<string> {
  let files = fs.readdirSync(dir, {withFileTypes: true})
  return files.reduce((acc, file) => {
    if (file.isFile()) {
      acc.push(path.join(dir, file.name))
    }
    return acc
  }, [])
}
