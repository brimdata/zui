/* @noflow */
const fs = require("fs")
const os = require("os")
const installer = require("electron-winstaller")
const debInstaller = require("electron-installer-debian")
const createDMG = require("electron-installer-dmg")
const createZip = require("electron-installer-zip")
const path = require("path")

const out = "./dist/installers"
const appPath = "dist/packages/Brim-darwin-x64/Brim.app"

module.exports = {
  darwin: async function() {
    console.log("Building installer for darwin")
    await createDMG(
      {
        overwrite: true,
        appPath,
        name: "Brim",
        out
      },
      (err) => {
        if (err) {
          throw new Error("Error builing darwin installer " + err)
        }
        console.log("Built installer for darwin in " + out)
      }
    )

    await createZip(
      {
        dir: appPath,
        out: path.join(out, "Brim-darwin-autoupdater.zip")
      },
      (err) => {
        if (err) {
          throw new Error("Error zipping darwin package: " + err)
        }
        console.log("Zip for darwin package written in " + out)
      }
    )
  },

  win32: function(opts) {
    console.log("Building installer for win32")
    fixWindowsInstallerDeps()
    return installer
      .createWindowsInstaller({
        ...opts,
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
      .catch(() => {
        // Exception caught above is not printed below, as a bubbling
        // up exception may contain a passphrase.
        console.log("Error building win32 installer")
      })
  },

  debian: function() {
    console.log("Building installer for debian")
    return debInstaller({
      src: "./dist/packages/Brim-linux-x64",
      dest: out,
      arch: "amd64",
      rename: (dest) => {
        return path.join(dest, "<%= name %>_<%= arch %>.deb")
      },
      options: {
        homepage: "https://www.brimsecurity.com",
        icon: "./dist/static/AppIcon.png",
        maintainer: "Brim Security, Inc. <support@brimsecurity.com>"
      }
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
