const run = require("./util/run.cjs")

run("node", "scripts/download-zdeps.cjs", {
  desc: "Downloading zdeps (skip with ZDEPS=false yarn)",
  if: process.env.ZDEPS !== "false",
})
