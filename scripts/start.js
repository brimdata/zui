const sub = require("./util/sub")
const log = require("./util/log")
const fs = require("fs-extra")

async function start() {
  fs.removeSync("dist")
  const electronArgs = process.argv.splice(2).join(" ")
  log("Compiling...")
  const main = sub("yarn", `build:js --watch`)
  const renderer = sub("yarn", `next dev`)
  await Promise.all([
    main.waitForOutput(/Watching for file changes/),
    renderer.waitForOutput(/compiled client and server successfully/),
  ])
  log("Launching...")
  sub("yarn", `electron . ${electronArgs}`).p.on("exit", () => {
    main.kill()
    renderer.kill()
  })
}

process.on("SIGINT", () => process.exit(0))

start()
