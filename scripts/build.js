const run = require("./util/run")
const {JS, SCSS, STATIC, HTML, PLUGIN_STATIC} = require("./util/commands")

async function build() {
  await run("node", "scripts/clean")
  await run("npx", STATIC, {desc: "Copying static files"})
  await run("npx", PLUGIN_STATIC, {desc: "Copying plugins' static files"})
  await run("npx", HTML, {desc: "Compiling html"})
  await run("npx", SCSS, {desc: "Compiling scss"})
  await run("npx", JS, {desc: "Compiling javascript"})
}

build()
