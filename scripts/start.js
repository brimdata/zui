const {bold} = require("chalk")
const run = require("./util/run")
const flags = require("./util/flags")
const {JS, SCSS, STATIC} = require("./util/commands")

async function start() {
  if (!flags.noBuild) {
    await run("node", "scripts/build")
  } else {
    console.log(bold("Skipping build step"))
  }
  run("npx", `${JS} --watch --skip-initial-build`)
  const ret = run("npx", `${SCSS} --watch --skip-initial`)
  console.log(ret)
  run("npx", `${STATIC} --watch`)
  run("npx", "livereload dist", {desc: "Watching dist for changes"})
  run("npx", "electron .", {desc: "Starting electron"})
}

process.on("SIGINT", () => process.exit(0))

start()
