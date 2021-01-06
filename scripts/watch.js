const {bold} = require("chalk")
const run = require("./util/run")
const {JS, SCSS, STATIC} = require("./util/commands")

async function watch() {
  console.log(bold("Watching for changes"))

  run("npx", `${JS} --watch --skip-initial-build`)
  run("npx", `${SCSS} --watch --skip-initial`)
  run("npx", `${STATIC} --watch`)
}

process.on("SIGINT", () => process.exit(0))

watch()
