/* @flow */
import {mkdirSync} from "fs"
import {spawn, ChildProcess} from "child_process"

import * as cmd from "../stdlib/cmd"

export class ZQD {
  zqd: ChildProcess
  root: string

  constructor(rootDir: string) {
    let not = cmd.notExists("zeek", "zqd", "zq", "mergecap")
    if (not.length > 0) {
      throw new Error("missing required executables: " + not.join(", "))
    }
    this.root = rootDir
  }

  start() {
    mkdirp(this.root)
    const opts = {
      cwd: this.root,
      stdio: "inherit"
    }
    this.zqd = spawn("zqd", ["listen"], opts)
    this.zqd.on("error", (err) => {
      // XXX should notify renderers of error
      console.log("error", err)
    })
  }

  // XXX Eventually we'll have the os choose a dynamic port. For now just
  // return static localhost:9867 as the zqd address.
  addr(): string {
    return "localhost:9867"
  }

  close() {
    if (this.zqd) {
      this.zqd.kill("SIGTERM")
    }
  }
}

function mkdirp(dir: string) {
  mkdirSync(dir, {recursive: true, mode: 0o755})
}
