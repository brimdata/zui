const run = require("./util/run")

run("node", "scripts/download-zdeps", {
  desc: "Downloading zdeps (skip with ZDEPS=false yarn)",
  if: process.env.ZDEPS !== "false",
})
