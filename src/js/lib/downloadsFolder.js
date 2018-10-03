// Code from https://github.com/juliangruber/downloads-folder
const os = require("os")
const execSync = require("child_process").execSync
const statSync = require("fs").statSync

module.exports = () => {
  return {
    darwin: darwin,
    freebsd: unix,
    linux: unix,
    sunos: unix,
    win32: windows
  }[os.platform()]()
}

module.exports.darwin = darwin
module.exports.unix = unix
module.exports.windows = windows

function darwin() {
  return `${process.env.HOME}/Downloads`
}

function unix() {
  let dir
  try {
    dir = execSync("xdg-user-dir DOWNLOAD", {stdio: [0, 3, 3]})
  } catch (e) {
    console.error(e)
  }
  if (dir) return dir

  let stat
  const homeDownloads = `${process.env.HOME}/Downloads`
  try {
    stat = statSync(homeDownloads)
  } catch (e) {
    console.error(e)
  }
  if (stat) return homeDownloads

  return "/tmp/"
}

function windows() {
  return `${process.env.USERPROFILE}/Downloads`
}
