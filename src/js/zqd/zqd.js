/* @flow */

import {outputFileSync, pathExistsSync, mkdirpSync} from "fs-extra"
import {spawn, ChildProcess} from "child_process"
import {join, resolve} from "path"
import {app} from "electron"
import _merge from "lodash/merge"
import log from "electron-log"

import * as cmd from "../stdlib/cmd"
import electronIsDev from "../electron/isDev"

// Paths for the zqd and zeek programs.
const zdepsDirectory = join(app.getAppPath(), "zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    zeekBin: "zeek"
  },
  linux: {
    zqdBin: "zqd",
    zeekBin: "zeek"
  },
  win32: {
    zqdBin: "zqd.exe",
    zeekBin: "zeek.exe"
  }
}

function writeZqdConfigFile(): string {
  const logDir = app.getPath("logs")
  mkdirpSync(logDir, {recursive: true, mode: 0o755})

  const zqdLogFile = join(logDir, "zqd-core.log")
  const accessLogFile = join(logDir, "zqd-access.log")

  log.info("zqd core log", zqdLogFile)
  log.info("zqd access log", accessLogFile)

  const data = `
logger:
  type: waterfall
  children:
  - name: http.access
    level: info
    path: ${accessLogFile}
    mode: rotate
  - level: info
    path: ${zqdLogFile}
    mode: rotate
`

  const confFile = join(app.getPath("userData"), "zqd-config.yaml")
  log.info("zqd config", confFile)

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

  const zqdBin = resolve(join(zdepsDirectory, plat.zqdBin))
  if (!pathExistsSync(zqdBin)) {
    throw new Error("zqd binary not present at " + zqdBin)
  }
  return zqdBin
}

function zeekRunnerCommand(): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  let zeekRunner = process.env.BRIM_ZEEK_RUNNER
  if (!zeekRunner) {
    zeekRunner = resolve(join(zdepsDirectory, "zeek", plat.zeekBin))
  }

  if (!pathExistsSync(zeekRunner)) {
    throw new Error("zeek runner not present at " + zeekRunner)
  }

  return zeekRunner
}

export class ZQD {
  zqd: ChildProcess
  root: string

  constructor(rootDir: string) {
    this.root = rootDir
  }

  start() {
    mkdirpSync(this.root, {recursive: true, mode: 0o755})

    const opts = {
      stdio: "inherit"
    }

    const confFile = writeZqdConfigFile()

    const args = [
      "listen",
      "-l",
      this.addr(),
      "-datadir",
      this.root,
      "-config",
      confFile,
      "-zeekrunner",
      zeekRunnerCommand()
    ]
    log.info("spawning zqd:", zqdCommand(), args.join(" "))

    this.zqd = spawn(zqdCommand(), args, opts)
    this.zqd.on("error", (err) => {
      // XXX should notify renderers of error
      log.error("zqd spawn error", err)
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
