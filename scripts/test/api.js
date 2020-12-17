const {execSync} = require("child_process")
const {exit, openStdin} = require("process")

const DENO_TEST = "deno test --allow-net --allow-run --allow-read --allow-write"
const ROLLUP = "npx rollup -c --silent"

const getCliOptions = () => {
  const [_n, _s, ...flags] = process.argv
  return {
    noBundle: flags.includes("--no-bundle")
  }
}

const run = (cmd, opts) => {
  if (opts.if === false) return
  if (opts.desc) console.log(opts.desc)
  try {
    execSync(cmd, {cwd: opts.cwd, stdio: "inherit"})
  } catch (_) {
    process.exit(1)
  }
}

const opts = getCliOptions()

run(ROLLUP, {
  desc: "Bundling Zealot with Rollup (skip with --no-bundle)",
  if: !opts.noBundle
})

run(DENO_TEST, {desc: "Testing with Deno", cwd: "test/api"})
