const fs = require("fs-extra")
const path = require("path")
const semver = require("semver")

const filePath = path.join(__dirname, "../package.json")
const package = fs.readJSONSync(filePath)

function suffix(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(".")
}
const currentVersion = semver.valid(semver.coerce(package.version))
const insiderVersion =
  semver.inc(currentVersion, "minor") + `-dev.${suffix(new Date())}`

console.log(" Current Version: ", currentVersion)
console.log("Insiders Version: ", insiderVersion)

package.version = insiderVersion
fs.writeFileSync(filePath, JSON.stringify(package, null, 2) + "\n")
console.log("Updated package.json")
