const {bold} = require("chalk")
const {spawn} = require("child_process")

function run(program, args, opts = {}) {
  return new Promise((resolve) => {
    if (opts.if === false) return resolve()
    if (opts.desc) console.log(bold(opts.desc))
    const subprocess = spawn(program, [args], {
      shell: true,
      stdio: "inherit",
      cwd: opts.cwd
    })
    subprocess.on("exit", (code) => {
      if (code !== 0) process.exit(code)
      else resolve()
    })
    subprocess.on("error", (e) => process.exit(e.code))
  })
}

module.exports = run
