const {bold} = require("chalk")
const run = require("./util/run")
const {JS, SCSS, STATIC, HTML} = require("./util/commands")

async function watch() {
  console.log(bold("Watching for changes"))

  run("yarn", `${JS} --watch`)
  run("yarn", `${SCSS} --watch --skip-initial`)
  run("yarn", `${STATIC} --watch`)
  run("yarn", `${HTML} --watch`)
}

process.on("SIGINT", () => process.exit(0))

watch()
