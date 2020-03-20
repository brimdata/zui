/* @noflow */
const fs = require("fs")
const os = require("os")
const installer = require("electron-winstaller")
const createDMG = require("electron-installer-dmg")
const path = require("path")

const out = "./dist/installers"

module.exports = {
  darwin: function() {
    console.log("Building installer for darwin")
    createDMG(
      {
        overwrite: true,
        appPath: "dist/packages/Brim-darwin-x64/Brim.app",
        name: "Brim",
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
        appDirectory: "./dist/packages/Brim-Win32-x64",
        outputDirectory: out,
        authors: "Brim Security, Inc.",
        exe: "Brim.exe",
        setupExe: "Brim-Setup.exe",
        noMsi: true
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
      path.join(__dirname, "vendor", "7z.exe"),
      "node_modules/electron-winstaller/vendor/7z.exe"
    )
    fs.copyFileSync(
      path.join(__dirname, "vendor", "7z.dll"),
      "node_modules/electron-winstaller/vendor/7z.dll"
    )
  }
}
