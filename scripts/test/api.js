const run = require("./util/run")
const flags = require("./util/flags")

run("npx rollup -c --silent", {
  desc: "Bundling Zealot with Rollup (skip with --no-bundle)",
  if: !flags.noBundle
})

run("deno test --allow-net --allow-run --allow-read --allow-write", {
  desc: "Testing with Deno",
  cwd: "test/api"
})
