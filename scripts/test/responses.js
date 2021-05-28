/**
 * This will spin up a new instance of zqd for each of the responses
 * saved in the config file, ingest the input file, run the query,
 * and save the response in the output file.
 *
 * It will use the zqd bundled in zdeps.
 *
 * Before running this, run these commands once:
 *   1. npm install # to install the desired version of zqd
 *
 *  Then run this script: node scripts/test/responses.js
 */

const {fork} = require("child_process")
const fs = require("fs-extra")
const glob = require("glob")
const config = require("../../test/shared/responses/config")

function saveResponse(input, output, query) {
  const search = fork("./scripts/test/search", [input, query], {
    shell: true,
    silent: true
  })
  const out = fs.createWriteStream(output)
  search.stdout.pipe(out)
  search.stdout.pipe(process.stdout)
  search.stderr.pipe(process.stderr)
  return new Promise((resolve) => {
    search.on("close", () => {
      resolve()
    })
  })
}

async function main() {
  glob.sync("test/responses/*.response").forEach((file) => fs.removeSync(file))

  for (const key in config) {
    const {input, output, query} = config[key]
    const inFile = `test/shared/data/${input}`
    const outFile = `test/shared/responses/${output}`
    await saveResponse(inFile, outFile, query)
  }
}

main()
