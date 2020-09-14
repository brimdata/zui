const fs = require("fs-extra")

export function write(path, contents) {
  fs.ensureFileSync(path)
  fs.writeFileSync(path, contents)
  console.log(`Created: ${path}`)
}

export function append(path, contents) {
  fs.appendFileSync(path, contents)
  console.log(`Appended: ${path}`)
}
