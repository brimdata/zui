/* @noflow */
const fs = require("fs")
const os = require("os")
const installer = require("electron-winstaller")
const createDMG = require("electron-installer-dmg")

const out = "./dist/installers"

module.exports = {
  darwin: function() {
    console.log("Building installer for darwin")
    createDMG(
      {
        appPath: "dist/packages/Looky-darwin-x64/Looky.app",
        name: "Looky",
        out
      },
      (err) => {
        if (!err) {
          console.log("Built installer for darwin in " + out)
        } else {
          console.log("Error builing darwin installer " + err)
        }
      }
    )
  },

  win32: function() {
    console.log("Building installer for win32")
    fixWindowsInstallerDeps()
    return installer
      .createWindowsInstaller({
        appDirectory: "./dist/packages/Looky-Win32-x64",
        outputDirectory: out,
        authors: "Looky Labs, Inc.",
        exe: "Looky.exe"
      })
      .then(() => {
        console.log("Built installer for win32 in " + out)
      })
      .catch((e) => {
        console.log("Error building win32 installer: " + e.message)
      })
  }
}

function fixWindowsInstallerDeps() {
  // Hack Workaround
  // We needed to download 7 Zip 32bit and copy it into electron-winstaller/vendor
  // to replace the 64bit version in there that does not work on our 32bit wine
  // installation.
  //
  // https://github.com/electron/windows-installer/issues/186#issuecomment-313222658
  if (os.platform() === "darwin") {
    fs.copyFileSync(
      "pix/vendor/7z.exe",
      "node_modules/electron-winstaller/vendor/7z.exe"
    )
    fs.copyFileSync(
      "pix/vendor/7z.dll",
      "node_modules/electron-winstaller/vendor/7z.dll"
    )
  }
}
