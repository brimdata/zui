/* @noflow */

const program = require("commander")
const pack = require("./pack")
const install = require("./install")

program
  .option("--win32", "Release for Windows")
  .option("--darwin", "Release for MacOS")
  .action(function(cmd) {
    if (cmd.darwin) pack.darwin().then(() => install.darwin())
    if (cmd.win32) pack.win32().then(() => install.win32())
  })
  .parse(process.argv)
