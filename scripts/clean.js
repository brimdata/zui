const fs = require("fs-extra")
const glob = require("glob")
const {bold} = require("chalk")
const flags = require("./util/flags")

console.log(bold("Cleaning built files"))
if (!flags.keepDist) {
  fs.removeSync("zealot/dist")
  fs.removeSync("dist")
} else {
  console.log(bold("Keeping dist directories"))
}
// These are broken symlinks that electron leaves around when it
// forcefully exists and can't clean them up. Babel tries to call
// stat on the broken symlinks and blows up.
glob.sync("run/**/SingletonCookie").forEach((file) => fs.removeSync(file))
glob.sync("run/**/SingletonLock").forEach((file) => fs.removeSync(file))
glob.sync("run/SS").forEach((file) => fs.removeSync(file))
