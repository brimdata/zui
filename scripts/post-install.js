const run = require("./util/run")

run("node scripts/download-zdeps", {
  desc: "Downloading zdeps (skip with ZDEPS=false npm install)",
  if: process.env.ZDEPS !== "false"
})
