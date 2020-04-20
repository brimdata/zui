/* @noflow */

const notarize = require("electron-notarize").notarize
const program = require("commander")
const pack = require("./pack")
const install = require("./install")

program
  .option("--win32", "Release for Windows")
  .option("--darwin", "Release for macOS")
  .option("--linux", "Release for Linux")
  .option("--sign", "Sign package (macOS only)", false)
  .option("--notarize", "Notarize package (macOS only)", false)
  .option(
    "--windowsCertificateFile <windowsCertificateFile>",
    "PFX signing cert (win32 only)",
    false
  )
  .option(
    "--windowsCertificatePassword <windowsCertificatePassword>",
    "PFX password (win32 only)",
    false
  )
  .action(function(cmd) {
    if (cmd.darwin) {
      let p = pack.darwin(cmd.sign || cmd.notarize)
      if (cmd.notarize)
        p.then(() =>
          notarize({
            appBundleId: "com.brimsecurity.brim",
            appPath: "dist/packages/Brim-darwin-x64/Brim.app",
            appleId: process.env.APPLEID_USER,
            appleIdPassword: process.env.APPLEID_PASSWORD
          })
        )
      p.then(() => install.darwin())
    }
    if (cmd.win32)
      pack.win32().then(() =>
        install.win32({
          certificateFile: cmd.windowsCertificateFile,
          certificatePassword: cmd.windowsCertificatePassword
        })
      )
    if (cmd.linux) pack.linux().then(install.debian)
  })
  .parse(process.argv)
