import {pathExistsSync, mkdirpSync} from "fs-extra"
import log from "electron-log"

import {app} from "electron"
import {join, resolve} from "path"
import {spawn, ChildProcess} from "child_process"

import * as cmd from "src/js/stdlib/cmd"
import electronIsDev from "src/js/electron/isDev"

// Paths for the zed and zeek programs. If the app has been built as a release then it will be contained in an asar archive
// but the zdeps will have been included in the .unpacked directory along side the archived app, hence the replace here. This
// pattern would apply to any assets under the 'asarUnpack' key of the electron-builder.json config
const zdepsDirectory = join(
  app.getAppPath().replace("app.asar", "app.asar.unpacked"),
  "zdeps"
)

const platformDefs = {
  darwin: {
    zedBin: "zed"
  },
  linux: {
    zedBin: "zed"
  },
  win32: {
    zedBin: "zed.exe"
  }
}

function zedCommand(): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zed")
  }

  if (electronIsDev && process.env.brim_zed_from_path) {
    if (cmd.notExists("zed").length > 0) {
      throw new Error("brim_zed_from_path is set but zed not in path")
    }
    return plat.zedBin
  }

  const zedBin = resolve(join(zdepsDirectory, plat.zedBin))
  if (!pathExistsSync(zedBin)) {
    throw new Error("zed binary not present at " + zedBin)
  }
  return zedBin
}

export class Lake {
  lake: ChildProcess

  constructor(public root: string, public port: number, public logs: string) {}

  start() {
    // @ts-ignore
    mkdirpSync(this.root, {recursive: true, mode: 0o755})
    // @ts-ignore
    mkdirpSync(this.logs, {recursive: true, mode: 0o755})

    const args = [
      "lake",
      "serve",
      "-l",
      this.addr(),
      "-R",
      this.root,
      "-log.level=info",
      "-log.filemode=rotate",
      "-log.path",
      join(this.logs, "zlake.log")
    ]

    const opts = {
      stdio: ["inherit", "inherit", "inherit"]
    }
    // For unix systems, pass posix pipe read file descriptor into lake process.
    // In the event of Brim getting shutdown via `SIGKILL`, this will let lake
    // know that it has been orphaned and to shutdown.
    if (process.platform !== "win32") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {readfd} = require("node-pipe").pipeSync()
      opts.stdio.push(readfd)
      args.push(`-brimfd=${opts.stdio.length - 1}`)
    }
    // XXX This belongs in the brimcap plugin.
    const suricataUserDir = join(app.getPath("userData"), "suricata")
    process.env.BRIM_SURICATA_USER_DIR = suricataUserDir
    log.info("spawning zed lake serve:", zedCommand(), args.join(" "))

    // @ts-ignore
    this.lake = spawn(zedCommand(), args, opts)
    this.lake.on("error", (err) => {
      // XXX should notify renderers of error
      log.error("lake spawn error", err)
    })
  }

  // XXX Eventually we'll have the os choose a dynamic port. For now just
  // return static localhost:9867 as the lake address.
  addr(): string {
    return `localhost:${this.port}`
  }

  async close(): Promise<void> {
    if (this.lake) {
      // give zed lake 5 seconds to exit
      let giveUp = false
      setTimeout(() => {
        giveUp = true
      }, 5000)
      this.lake.kill("SIGTERM")

      while (!giveUp && (await this.isUp())) {
        await new Promise((res) => setTimeout(res, 500))
      }

      if (giveUp) {
        log.error("gave up waiting for zed lake serve to shutdown")
      } else {
        log.info("zed lake has shutdown")
      }
    }
  }

  async isUp() {
    try {
      const response = await fetch(`http://${this.addr()}/status`)
      const text = await response.text()
      return text === "ok"
    } catch (e) {
      return false
    }
  }
}
