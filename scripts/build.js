const run = require("./util/run")
const {JS, SCSS, STATIC} = require("./util/commands")

async function build() {
  await run("node", "scripts/clean")
  await run("npx", STATIC, {desc: "Copying static files"})
  await run("npx", SCSS, {desc: "Compiling scss"})
  await run("npx", JS, {desc: "Compiling javascript"})
}

build()
