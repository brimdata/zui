const sub = require("./util/sub")
const log = require("./util/log")
const fs = require("fs-extra")

async function start() {
  fs.removeSync("dist")
  const electronArgs = process.argv.splice(2).join(" ")
  log("Compiling...")
  const js = sub("yarn", `build:js --watch`)
  const css = sub("yarn", `build:css --watch`)
  const zealot = sub("yarn", `workspace @brimdata/zealot run build --watch`)
  await Promise.all([
    css.waitForOutput(/Sass is watching for changes/),
    js.waitForOutput(/Watching for file changes/),
    zealot.waitForOutput(/Watching for file changes/),
  ])
  log("Launching...")
  sub("yarn", `electron . ${electronArgs}`)
  sub("yarn", "livereload 'dist, packages/zealot/dist'").silence()
}

process.on("SIGINT", () => process.exit(0))

start()
