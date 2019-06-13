/* @noflow */

var fs = require("fs")
var installer = require("electron-winstaller")

// Funky hack
// We needed to download 7zip 32bit and copy it into electron-winstaller/vendor
// to replace the 64bit version in there that does not work on our 32bit wine
// installation.
//
// https://github.com/electron/windows-installer/issues/186#issuecomment-313222658
fs.copyFileSync(
  "pix/vendor/7z.exe",
  "node_modules/electron-winstaller/vendor/7z.exe"
)
fs.copyFileSync(
  "pix/vendor/7z.dll",
  "node_modules/electron-winstaller/vendor/7z.dll"
)

installer
  .createWindowsInstaller({
    appDirectory: "./releases/Looky-Win32-x64",
    outputDirectory: "./releases/installers",
    authors: "Looky Labs, Inc.",
    exe: "Looky.exe"
  })
  .then(() => {
    console.log("Windows Installer Created")
  })
  .catch((e) => {
    console.log("Error creating installer: " + e.message)
  })
