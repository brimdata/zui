/**
 * This will spin up a new instance of zqd for each of the responses
 * saved in the config file, ingest the input file, run the query,
 * and save the response in the output file. It uses Deno to manage
 * the zqd process and the zealot calls. (search.deno.ts)
 *
 * It will use the zqd bundled in zdeps.
 *
 * Before running this, it would be good to:
 *   1. npm install # to install the desired version of zqd
 *   2. npx rollup -c --silent # to bundle the current version of zealot
 *
 *  Then run this script: node scripts/test/responses.js
 */

const {spawn} = require("child_process")
const fs = require("fs-extra")
const glob = require("glob")
const config = require("../../test/responses/config")

function saveResponse(input, output, query) {
  const deno = spawn(
    "deno",
    [`run --allow-all scripts/test/search.deno.ts '${input}' '${query}'`],
    {shell: true}
  )
  const out = fs.createWriteStream(output)
  deno.stdout.pipe(out)

  return new Promise((resolve) => {
    deno.on("close", () => {
      resolve()
    })
  })
}

async function main() {
  glob.sync("test/responses/*.response").forEach((file) => fs.removeSync(file))

  for (const key in config) {
    const {input, output, query} = config[key]
    const inFile = `test/data/${input}`
    const outFile = `test/responses/${output}`
    await saveResponse(inFile, outFile, query)
  }
}

main()
