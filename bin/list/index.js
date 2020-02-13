/* @flow */

const program = require("commander")

const {printSelectors} = require("./selectors")

program.command("selectors").action(printSelectors)
program.parse(process.argv)
