import {ChildProcess, spawn} from "child_process"
import {mkdirpSync} from "fs-extra"
import {join} from "path"
import {getPath} from "../cmd/paths"
import fetch from "cross-fetch"

const zedCommand = getPath("zed")

export class Lake {
  lake?: ChildProcess

  constructor(public root: string, public port: number, public logs: string) {}

  addr(): string {
    return `localhost:${this.port}`
  }

  start() {
    // @ts-ignore
    mkdirpSync(this.root, {recursive: true, mode: 0o755})
    // @ts-ignore
    mkdirpSync(this.logs, {recursive: true, mode: 0o755})

    const args = [
      "serve",
      "-l",
      this.addr(),
      "-lake",
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

    // @ts-ignore
    this.lake = spawn(zedCommand, args, opts) as ChildProcess
    this.lake.on("error", (err) => {
      console.error("lake spawn error", err)
    })

    return waitFor(async () => this.isUp())
  }

  async stop(): Promise<boolean> {
    if (this.lake) {
      this.lake.kill("SIGTERM")
      return waitFor(() => this.isDown())
    } else {
      return true
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

  async isDown() {
    return !(await this.isUp())
  }
}

async function waitFor(condition: () => Promise<boolean>) {
  let giveUp = false
  const id = setTimeout(() => {
    giveUp = true
  }, 5000)

  while (!giveUp) {
    if (await condition()) break
    await sleep(50)
  }

  clearTimeout(id)
  return !giveUp
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
