/* @flow */
import {IngestProcess} from "../src/js/zqd/ingest"

function main() {
  let args = process.argv.slice(2)
  let proc = new IngestProcess("./data/spaces", args)
  proc.on("space_updated", (payload) => {
    console.log(payload)
    payload.done && process.exit(0)
  })
  proc.start()
}

main()
