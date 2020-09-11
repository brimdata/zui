import {isEmpty} from "lodash"
import {outputFileSync, pathExistsSync, mkdirpSync} from "fs-extra"
import log from "electron-log"

import {app} from "electron"
import {join, resolve} from "path"
import {spawn, ChildProcess} from "child_process"

import * as cmd from "../stdlib/cmd"
import electronIsDev from "../electron/isDev"

// Paths for the zqd and zeek programs.
const zdepsDirectory = join(app.getAppPath(), "zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    zeekRunnerBin: "zeekrunner"
  },
  linux: {
    zqdBin: "zqd",
    zeekRunnerBin: "zeekrunner"
  },
  win32: {
    zqdBin: "zqd.exe",
    zeekRunnerBin: "zeekrunner.exe"
  }
}

function writeZqdConfigFile(): string {
  const logDir = app.getPath("logs")
  // @ts-ignore
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

function zeekRunnerCommand(zeekRunnerPref: string): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  const precedence = [
    process.env.BRIM_ZEEK_RUNNER,
    zeekRunnerPref,
    resolve(join(zdepsDirectory, "zeek", plat.zeekRunnerBin))
  ]

  return precedence.find((path) => !isEmpty(path)) || ""
}

export class ZQD {
  zqd: ChildProcess
  root: string
  zeekRunner: string

  constructor(rootDir: string, zeekRunner: string) {
    this.root = rootDir
    this.zeekRunner = zeekRunner
  }

  start() {
    // @ts-ignore
    mkdirpSync(this.root, {recursive: true, mode: 0o755})

    const opts = {
      stdio: ["inherit", "inherit", "inherit"]
    }

    const confFile = writeZqdConfigFile()

    const args = [
      "listen",
      "-l",
      this.addr(),
      "-data",
      this.root,
      "-config",
      confFile,
      "-zeekrunner",
      zeekRunnerCommand(this.zeekRunner)
    ]

    // For unix systems, pass posix pipe read file descriptor into zqd process.
    // In the event of Brim getting shutdown via `SIGKILL`, this will let zqd
    // know that it has been orphaned and to shutdown.
    if (process.platform !== "win32") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {readfd} = require("node-pipe").pipeSync()
      opts.stdio.push(readfd)
      args.push(`-brimfd=${opts.stdio.length - 1}`)
    }
    log.info("spawning zqd:", zqdCommand(), args.join(" "))

    // @ts-ignore
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
