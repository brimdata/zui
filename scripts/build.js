const run = require("./util/run")
const {JS, SCSS, STATIC, HTML, PLUGIN_STATIC} = require("./util/commands")

async function build() {
  await run("node", "scripts/clean")
  await run("yarn", STATIC, {desc: "Copying static files"})
  await run("yarn", PLUGIN_STATIC, {desc: "Copying plugins' static files"})
  await run("yarn", HTML, {desc: "Compiling html"})
  await run("yarn", SCSS, {desc: "Compiling scss"})
  await run("yarn", "workspaces foreach -t --no-private run build", {
    desc: "Building dependent workspaces"
  })
  await run("yarn", JS, {desc: "Compiling javascript"})
}

build()
