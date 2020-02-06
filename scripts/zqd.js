/* @flow */
import ingest from "../src/js/zqd/ingest"
import fs from "fs"

const root = "./data"
fs.rmdirSync(root, {recursive: true})
fs.mkdirSync(root, {recursive: true, mode: 0o755})

async function main() {
  let args = process.argv.slice(2)
  let {promise: proc, cancel} = ingest(root, args)
  process.on("SIGINT", () => {
    cancel()
  })
  console.log("got proc")

  try {
    await proc
    console.log("hi")
  } catch (error) {
    console.log("error", error)
  } finally {
    console.log("finally")
  }

  process.exit(0)
}

main()
