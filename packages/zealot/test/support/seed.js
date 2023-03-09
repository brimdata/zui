const {Client} = require("../..")
const fsExtra = require("fs-extra")
const client = new Client("http://localhost:9000")
const path = require("path")

const file = path.join(__dirname, "../sample-data/prs.json")
const readable = fsExtra.createReadStream(file)

async function main() {
  try {
    await client.deletePool("prs")
  } catch (e) {}

  await client.createPool("prs")
  await client.load(readable, {pool: "prs"})
}

main()
