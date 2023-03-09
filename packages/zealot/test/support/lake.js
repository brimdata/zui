const path = require("path")
const {Lake} = require("../..")
const {removeSync} = require("fs-extra")

const root = path.join(__dirname, "..", "..", "_lake", "root")
const logs = path.join(__dirname, "..", "..", "_lake", "logs")

removeSync(root)
removeSync(logs)

async function main() {
  const lake = new Lake({root, port: 9000, logs})
  await lake.start()
  console.log("Lake started on port 9000")
}

main()
