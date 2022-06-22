const sub = require("./util/sub")
const fs = require("fs-extra")
const path = require("path")
const semver = require("semver")
const log = require("./util/log")
const {bold} = require("chalk")

const packageJSON = fs.readJSONSync(path.join(__dirname, "../package.json"))

// This needs to be shared here and in the app when we get the channel
function getChannel(version) {
  if (!semver.valid(version)) {
    throw new Error("package.json does not have a valid version: " + version)
  }
  const pre = semver.prerelease(version)
  if (pre === null) return "latest"
  if (pre[0] === "beta") return "beta"
  if (pre[0] === "alpha") return "alpha"
  throw new Error(
    "Unknown release channel: " + pre[0] + ". Can be latest, beta, or alpha"
  )
}

const channel = getChannel(packageJSON.version)
// console.log(`         ###                          ###         `)
console.log("")
console.log(`############     BUILDING RELEASE     ############`)
console.log("")
// console.log(`         ###                          ###         `)
log("Platform: ", bold(process.platform))
log("Version: ", bold(packageJSON.version))
log("Channel: ", bold(channel))

switch (channel) {
  case "latest":
    sub("yarn", "electron-builder")
    break
  case "beta":
    sub("yarn", "electron-builder -c electron-builder-beta.json")
    break
}
