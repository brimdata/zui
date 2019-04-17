/* @flow */

const program = require("commander")

const {handleActionTypes} = require("./actionTypes")
const {handleStyle} = require("./style")

program.command("style <name>").action(handleStyle)
program.command("actionTypes").action(handleActionTypes)
program.parse(process.argv)
