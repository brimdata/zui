const {execSync} = require("child_process")

const DENO_TEST = "deno test --allow-net --allow-run --allow-read --allow-write"
const ROLLUP = "npx rollup -c"

const getCliOptions = () => {
  const [_n, _s, ...flags] = process.argv
  return {
    noBundle: flags.includes("--no-bundle")
  }
}

const run = (cmd, cwd) => {
  try {
    execSync(cmd, {cwd, stdio: "inherit"})
  } catch (e) {}
}

const opts = getCliOptions()

if (!opts.noBundle) run(ROLLUP)
run(DENO_TEST, "test/api")
