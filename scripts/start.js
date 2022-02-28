const sub = require("./util/sub")

const log = (...args) => {
  console.log("‣", ...args)
}

async function start() {
  const electronArgs = process.argv.splice(2).join(" ")
  log("Compiling...")
  const js = sub("yarn", `build:js --watch`)
  const css = sub("yarn", `build:css --watch`)
  await Promise.all([
    css.waitForOutput(/Wrote CSS/),
    js.waitForOutput(/Watching for file changes/)
  ])
  log("Launching...")
  sub("yarn", `electron . ${electronArgs}`)
  sub("yarn", "livereload dist")
}

process.on("SIGINT", () => process.exit(0))

start()
