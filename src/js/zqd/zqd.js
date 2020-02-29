/* @flow */

import {pathExistsSync, mkdirSync} from "fs-extra"
import {spawn, ChildProcess} from "child_process"
import {join, resolve} from "path"
import {app} from "electron"

import * as cmd from "../stdlib/cmd"
import electronIsDev from "../electron/isDev"

// Path and filename for the zqd executable.
const zqdPath = join(app.getAppPath(), "zdeps")
const platformDefs = {
  darwin: {
    zqdBin: "zqd"
  },
  linux: {
    zqdBin: "zqd"
  },
  win32: {
    zqdBin: "zqd.exe"
  }
}

function zqdCommand(): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  if (electronIsDev && process.env.brim_zqd_from_path) {
    if (cmd.notExists("zqd").length > 0) {
      throw new Error("brim_zqd_from_path is set but zqd not in path")
    }
    return plat.zqdBin
  }

  const zqdBin = resolve(join(zqdPath, plat.zqdBin))
  if (!pathExistsSync(zqdBin)) {
    throw new Error("zqd binary not present at " + zqdBin)
  }
  return zqdBin
}

export class ZQD {
  zqd: ChildProcess
  root: string

  constructor(rootDir: string) {
    let not = cmd.notExists("zeek")
    if (not.length > 0) {
      throw new Error("missing required executables: " + not.join(", "))
    }
    this.root = rootDir
  }

  start() {
    mkdirpSync(this.root)
    const opts = {
      stdio: "inherit"
    }

    this.zqd = spawn(
      zqdCommand(),
      ["listen", "-l", this.addr(), "-datadir", this.root],
      opts
    )
    this.zqd.on("error", (err) => {
      // XXX should notify renderers of error
      console.log("zqd spawn error", err)
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

function mkdirpSync(dir: string) {
  mkdirSync(dir, {recursive: true, mode: 0o755})
}
