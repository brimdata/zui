/* @flow */

const fs = require("fs-extra")

export function write(path: string, contents: string) {
  fs.ensureFileSync(path)
  fs.writeFileSync(path, contents)
  console.log(`Created: ${path}`)
}

export function append(path: string, contents: string) {
  fs.appendFileSync(path, contents)
  console.log(`Appended: ${path}`)
}
