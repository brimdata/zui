/* @flow */
import rimraf from "rimraf"

import {ChildProcess, spawn} from "child_process"
import EventEmitter from "events"
import fs from "fs"
import os from "os"
import path from "path"

const zqTimeoutDur = 4000

export class IngestProcess extends EventEmitter {
  zeek: ?ChildProcess
  zq: ?Promise<void>
  zqCancel: ?() => void
  tmpdir: string
  spacedir: string
  space: string
  pcaps: Array<string>
  timeout: *

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
    this.zeek.on("exit", this.zeekExit)
    // Once files start hitting tmpdir start the zq writer loop.
    let watcher = fs.watch(this.tmpdir)
    watcher.on("change", (event) => {
      if (event == "rename") {
        this.loop()
        watcher.close()
      }
    })
    return this.space
  }

  loop = async () => {
    await this.runZQ()
    if (!this.timeout) {
      // setup timeout loop
      this.timeout = setTimeout(this.loop, zqTimeoutDur)
    }
    // $FlowFixMe
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
  const mergecap = spawn("mergecap", ["-w", "-", ...pcaps], {
    encoding: "buffer"
  })
  const zeek = spawn("zeek", ["-r", "-"], {cwd: tmpdir})
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
  const tmpfile = path.join(dst, "all.bzng.tmp")
  const w = fs.createWriteStream(tmpfile)
  const zq = spawn("zq", ["-f", "bzng", query, ...files], {encoding: "buffer"})
  zq.stdout.pipe(w)
  let p = new Promise((resolve, reject) => {
    w.on("close", () => {
      fs.renameSync(tmpfile, path.join(dst, "all.bzng"))
      resolve()
    })
    zq.on("error", reject)
  })
  return [p, zq.kill]
}

function createspace(dir: string): [string, string] {
  let spacedir = fs.mkdtempSync(path.join(dir, "untitled-"))
  let {name} = path.parse(spacedir)
  return [spacedir, name]
}

type Dirent = {
  name: string,
  isFile: () => boolean
}

function logfiles(dir: string): string[] {
  let files = fs.readdirSync(dir, {encoding: "utf-8", withFileTypes: true})

  // $FlowFixMe
  return files.reduce((acc, file: Dirent) => {
    if (file.isFile()) {
      acc.push(path.join(dir, file.name))
    }
    return acc
  }, [])
}
