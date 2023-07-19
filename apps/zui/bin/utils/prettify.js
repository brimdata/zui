const child_process = require("child_process")

export function prettify(filename) {
  child_process.execSync(`npx prettier --write ${filename}`)
}
