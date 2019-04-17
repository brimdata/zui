/* @flow */

const child_process = require("child_process")

export function prettify(filename: string) {
  child_process.execSync(`npx prettier --write ${filename}`)
}
