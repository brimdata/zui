/* @flow */

import {outputFileSync, pathExistsSync, mkdirSync} from "fs-extra"
import {spawn, ChildProcess} from "child_process"
import {join, resolve} from "path"
import {app} from "electron"
import _merge from "lodash/merge"

import * as cmd from "../stdlib/cmd"
import electronIsDev from "../electron/isDev"

// Paths for the zqd and zeek programs.
const zqdPath = join(app.getAppPath(), "zdeps")
const zqdZeekPath = join(zqdPath, "zeek")

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

function writeZqdConfigFile(): string {
  const logDir = join(app.getAppPath(), "logs")
  mkdirSync(logDir, {recursive: true, mode: 0o755})

  const zqdLogFile = join(logDir, "zqd-core.log")
  const accessLogFile = join(logDir, "zqd-access.log")

  const data = `
loggers:
  - name: zqd
    level: info
    path: ${zqdLogFile}
    mode: rotate
  - name: http.access
    level: info
    path: ${accessLogFile}
    mode: rotate
`

  const confFile = join(app.getAppPath(), "zdeps", "zqd-config.yaml")
  outputFileSync(confFile, data)
  return confFile
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
    this.root = rootDir
  }

  start() {
    mkdirSync(this.root, {recursive: true, mode: 0o755})

    // PATH must include both the zqd and zeek bin directories, as zqd depends
    // on have zeek in its PATH.
    const zqdEnvironment = _merge({}, process.env, {
      PATH: [zqdPath, zqdZeekPath, process.env.PATH].join(":")
    })
    const opts = {
      stdio: "inherit",
      env: zqdEnvironment
    }

    const confFile = writeZqdConfigFile()

    this.zqd = spawn(
      zqdCommand(),
      ["listen", "-l", this.addr(), "-datadir", this.root, "-config", confFile],
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
