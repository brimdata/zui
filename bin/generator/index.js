/* @flow */

const program = require("commander")

const {handleReducer} = require("./reducer")
const {handleStyle} = require("./style")
const {handleIcon} = require("./icon")

program.command("style <name>").action(handleStyle)
program.command("reducer <name>").action(handleReducer)
program.command("icon <path>").action(handleIcon)
program.parse(process.argv)
