const {spawn} = require("child_process")
const fs = require("fs-extra")
const glob = require("glob")
const config = require("../../test/responses/config")

// In order for this to work, rollup the zealot module first
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
