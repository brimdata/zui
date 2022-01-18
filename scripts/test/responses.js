/**
 * This will spin up a new instance of zqd for each of the responses
 * saved in the config file, ingest the input file, run the query,
 * and save the response in the output file.
 *
 * It will use the zqd bundled in zdeps.
 *
 * Before running this, run these commands once:
 *   1. yarn # to install the desired version of zqd
 *   2. yarn run build # to build some test files we need
 *
 *  Then run this script: node scripts/test/responses.js
 *  To save the responses, use the --save option
 *  To not print to stdio, use the --silent option
 */

const {fork} = require("child_process")
const fs = require("fs-extra")
const glob = require("glob")
const config = require("../../test/shared/responses/config")
const flags = require("../util/flags")
const {normalize} = require("path")

function saveResponse(input, output, query) {
  const search = fork("./scripts/test/search", [input, query], {
    shell: true,
    silent: true
  })

  if (flags.save) {
    const out = fs.createWriteStream(output)
    search.stdout.pipe(out)
  }
  if (!flags.silent) {
    search.stdout.pipe(process.stdout)
    search.stderr.pipe(process.stderr)
  }
  return new Promise((resolve, reject) => {
    search.on("exit", (code) => {
      if (code !== 0) reject()
    })
    search.on("close", () => {
      resolve()
    })
  })
}

async function main() {
  glob.sync("test/responses/*.response").forEach((file) => fs.removeSync(file))

  for (const key in config) {
    const {input, output, query} = config[key]
    const inFile = normalize(`test/shared/data/${input}`)
    const outFile = normalize(`test/shared/responses/${output}`)
    await saveResponse(inFile, outFile, query)
  }
}
main()
