/* @flow */
import "regenerator-runtime"
import {ztestDir} from "./env"
import {mkdirp} from "fs-extra"
import {spawn, exec} from "child_process"

const newZQD = (dataDir: string) => {
  const opts = {
    stdio: "inherit"
  }
  const args = ["listen", "-l", "localhost:9867", "-datadir", dataDir]
  exec("which zqd", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })

  let zqd
  return {
    start() {
      zqd = spawn("zqd", args, opts)
      zqd.on("error", (err) => {
        console.error("zqd spawn error", err)
      })
    },
    stop() {
      zqd && zqd.kill("SIGTERM")
    }
  }
}

module.exports = async () => {
  await mkdirp(ztestDir())
  const zqd = newZQD(ztestDir())
  zqd.start()
  global.__ZQD__ = zqd
}
