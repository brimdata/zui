import {pathsClient} from "app/ipc/paths"
import {ChildProcess, spawn} from "child_process"
import fs from "fs-extra"
import readline from "readline"
import tee from "tee-1"

/**
 * Data in the app was stored in a file store in versions before 25.
 * Now they are stored in a zed lake. This class checks to see if
 * there are any filestore spaces on the system and migrates them.
 */
export default class SpaceMigrator {
  process: ChildProcess | null

  constructor(readonly srcDir: string, readonly destDir: string) {}

  needMigration() {
    if (fs.existsSync(this.srcDir)) {
      return true
    } else {
      return false
    }
  }

  cancel() {
    if (this.process) {
      this.process.kill()
    }
  }

  async migrate(onUpdate) {
    await fs.ensureDir(this.destDir)
    const cmd = await pathsClient.brimcap()
    return new Promise<void>((resolve, reject) => {
      this.process = spawn(cmd, [
        "migrate",
        `-zqd=${this.srcDir}`,
        `-root=${this.destDir}`
      ])
      let stderr = this.process.stderr.pipe(tee(process.stderr))
      const linesErr = readline.createInterface({input: stderr})
      let total = 0
      let count = 0
      let space = ""
      let totalRegexp = /^migrating (\d+) spaces$/

      linesErr.on("line", (line) => {
        console.log(line)
        const status = tryJson(line.toString())
        if ("msg" in status) {
          const match = status.msg.match(totalRegexp)
          if (match) {
            total = parseInt(match[1])
          }
        }
        if ("space" in status && status.space !== space) {
          space = status.space
          count++
          onUpdate({total, space, count})
        }
      })

      this.process.on("error", (e) => {
        reject(e)
      })

      this.process.on("exit", (code) => {
        if (this.process.killed) {
          reject("Migration was cancelled")
        } else if (code !== 0) {
          reject("Migration failed")
        } else resolve()
      })
    }).finally(() => {
      this.process = null
    })
  }
}

function tryJson(data) {
  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}
