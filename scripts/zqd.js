/* @flow */
import {IngestProcess} from "../src/js/zqd/ingest"
import fs from "fs"

const root = "./data"
fs.rmdirSync(root, {recursive: true})
fs.mkdirSync(root, {recursive: true, mode: 0o755})

async function main() {
  let args = process.argv.slice(2)
  let proc = new IngestProcess(root, args)
  let spacedir = await proc.start()
  const abort = () => {
    proc.kill()
    process.off("SIGINT", abort)
  }
  process.on("SIGINT", abort)
  proc.on("space_updated", (event) => {
    console.log("space_updated", event)
  })
  await new Promise((resolve, reject) => {
    proc.on("error", reject)
    proc.on("complete", resolve)
  })
  console.log("process.exit")
  process.exit(0)
}

main()
