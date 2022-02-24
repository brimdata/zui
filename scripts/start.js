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

  run("yarn", `${JS} --watch`)
  run("yarn", `${SCSS} --watch --skip-initial`)
  run("yarn", `${STATIC} --watch`)
  run("yarn", "livereload dist", {desc: "Watching dist for changes"})
  run("yarn", `electron . ${electronArgs}`, {
    desc: `Starting electron ${electronArgs}`
  })
}

process.on("SIGINT", () => process.exit(0))

start()
