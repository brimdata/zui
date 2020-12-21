const {execSync} = require("child_process")

const run = (cmd, opts) => {
  if (opts.if === false) return
  if (opts.desc) console.log(opts.desc)
  try {
    execSync(cmd, {cwd: opts.cwd, stdio: "inherit"})
  } catch (_) {
    process.exit(1)
  }
}

module.exports = run
