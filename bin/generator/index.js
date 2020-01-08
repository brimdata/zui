/* @flow */

const program = require("commander")

const {handleReducer} = require("./reducer")
const {handleStyle} = require("./style")

program.command("style <name>").action(handleStyle)
program.command("reducer <name>").action(handleReducer)
program.parse(process.argv)
