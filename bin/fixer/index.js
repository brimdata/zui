/* @flow */

const program = require("commander")

const {handleRefs} = require("./refs")

program.command("refs").action(handleRefs)

program.parse(process.argv)
