const cli = require("commander")

const {handleMigration} = require("./migration")
const {handleReducer} = require("./reducer")

cli.command("reducer <name>").action(handleReducer)
cli.command("migration <name>").action(handleMigration)

cli.on("command:*", function() {
  console.error("Invalid command: %s", cli.args[0])
  cli.outputHelp()
  process.exit(1)
})

cli.parse(process.argv)
