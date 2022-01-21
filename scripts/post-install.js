const run = require("./util/run")

run("node", "scripts/download-zdeps", {
  desc: "Downloading zdeps (skip with ZDEPS=false yarn)",
  if: process.env.ZDEPS !== "false"
})

run("yarn", "workspaces foreach -t --no-private run build", {
  desc: "Building dependent workspaces"
})
