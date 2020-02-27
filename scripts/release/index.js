/* @noflow */

const program = require("commander")
const pack = require("./pack")
const install = require("./install")

program
  .option("--win32", "Release for Windows")
  .option("--darwin", "Release for macOS")
  .option("--sign", "Sign package (currently only macOS)", false)
  .action(function(cmd) {
    if (cmd.darwin) pack.darwin(cmd.sign).then(() => install.darwin())
    if (cmd.win32) pack.win32().then(() => install.win32())
  })
  .parse(process.argv)
