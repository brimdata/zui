const {bold} = require("chalk")
const run = require("./util/run")
const flags = require("./util/flags")
const {JS, SCSS, STATIC} = require("./util/commands")

async function start() {
  const electronArgs = process.argv.splice(2).join(" ")

  if (!flags.noBuild) {
    await run("node", "scripts/build")
  } else {
    console.log(bold("Skipping build step"))
  }

  run("npx", `${JS} --watch --skip-initial-build`)
  run("npx", `${SCSS} --watch --skip-initial`)
  run("npx", `${STATIC} --watch`)
  run("npx", "livereload dist", {desc: "Watching dist for changes"})
  run("npx", `electron . ${electronArgs}`, {
    desc: `Starting electron ${electronArgs}`
  })
}

process.on("SIGINT", () => process.exit(0))

start()
