const fs = require("fs-extra")

function write(path, contents) {
  fs.ensureFileSync(path)
  fs.writeFileSync(path, contents)
  console.log(`Created: ${path}`)
}

function append(path, contents) {
  fs.appendFileSync(path, contents)
  console.log(`Appended: ${path}`)
}

module.exports = {write, append}
