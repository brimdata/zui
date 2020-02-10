/* @flow */
import fs from "fs"
import path from "path"
import os from "os"
import util from "util"
import {execFile, ChildProcess, spawn} from "child_process"
import EventEmitter from "events"
import {Timeout} from "timers"
import rimraf from "rimraf"

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

  start(): string {
    this.zeek = startZeek(this.tmpdir, this.pcaps)
    // event 'started' is emitted once data starts flowing out of mergecap. This
    // is a good time to start the zq writer loop.
    this.zeek.once("started", this.loop)
    this.zeek.on("exit", this.zeekExit)
    return this.space
  }

  loop = async () => {
    await this.runZQ()
    if (!this.timeout) {
      // setup timeout loop
      this.timeout = setTimeout(this.loop, zqTimeoutDur)
    }
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
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.zqCancel) {
      this.zqCancel()
    }
    // if zeek was killed no need to run zq return
    if (zeek && zeek.killed) {
      return
    }
    await this.runZQ()
    // delete tmpdir
    rimraf.sync(this.tmpdir, {recursive: true})
    this.emit("complete")
  }

  kill() {
    this.zeek && this.zeek.kill()
    this.zqCancel && this.zqCancel()
  }
}

function startZeek(tmpdir: string, pcaps: Array<string>): ChildProcess {
  const mergecap = spawn("mergecap", ["-w", "-", ...pcaps])
  const zeek = spawn("zeek", ["-r", "-"], {cwd: tmpdir})
  mergecap.stdout.once("data", () => {
    // XXX this isn't a good indicator that data is ready to slurp. Should
    // probably just watch for file events.
    zeek.emit("started")
  })
  mergecap.stdout.pipe(zeek.stdin).on("error", (err) => {
    // error EPIPE most likely means the main process recieved a SIGINT signal
    // and mergecap attempted to write on a closed zeek process. We can safely
    // ignore this error.
    if (err.code == "EPIPE") {
      return
    }
    throw err
  })
  return zeek
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
