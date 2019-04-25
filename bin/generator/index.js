/* @flow */

const program = require("commander")

const {handleStyle} = require("./style")

program.command("style <name>").action(handleStyle)
program.parse(process.argv)
