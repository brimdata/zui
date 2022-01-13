import {spawn, ChildProcess} from "child_process"
import fs, {FileHandle} from "fs/promises"
import {Client} from ".."
import path from "path"
import fkill from "fkill"

export class ZedLake {
  p: ChildProcess | undefined
  l: FileHandle | undefined
  port: number
  root: string
  log: string

  constructor(port: number) {
    this.port = port
    this.log = path.join(__dirname, `../../logs/${port}.log`)
    this.root = path.join(__dirname, `../../.roots/${port}`)
  }

  async start() {
    await fkill(":" + this.port, {silent: true})
    await fs.rm(this.log, {recursive: true})
    await fs.rm(this.root, {recursive: true})
    await new Promise((r) => setTimeout(r, 3000))
    await fs.mkdir("./logs", {recursive: true})
    await fs.mkdir(this.root, {recursive: true})

    this.l = await fs.open(this.log, "a")
    const stream = this.l.createWriteStream()
    const address = `localhost:${this.port}`
    const args = [`zed lake serve -l ${address} -R ${this.root}`]
    this.p = spawn("npx", args, {
      stdio: [stream, stream, stream],
      shell: true
    })

    const client = new Client(address)

    return new Promise<Client>((resolve, reject) => {
      let tries = 0
      const connect = async () => {
        if (tries === 30) {
          this.l?.close()
          reject(`Tried 30 times to connect to zed lake: logs at: ${this.log}`)
        }
        try {
          await fs.stat(path.join(this.root, "pools", "HEAD"))
          resolve(client)
        } catch (e) {
          tries++
          setTimeout(connect, 50)
        }
      }
      connect()
    })
  }

  async stop() {
    this.l?.close()
    await fkill(":" + this.port, {silent: true})
  }
}
