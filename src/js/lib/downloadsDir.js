// Code from https://github.com/juliangruber/downloads-folder
import os from "os"
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
  let stat
  const homeDownloads = `${process.env.HOME}/Downloads`
  try {
    stat = statSync(homeDownloads)
  } catch (e) {
    e
  }
  if (stat) return homeDownloads

  return "/tmp/"
}

function windows() {
  return `${process.env.USERPROFILE}/Downloads`
}
