import cli from "commander"

import {handleIcon} from "./icon"
import {handleMigration} from "./migration"
import {handleReducer} from "./reducer"
import {handleStyle} from "./style"

cli.command("style <name>").action(handleStyle)
cli.command("reducer <name>").action(handleReducer)
cli.command("icon <path>").action(handleIcon)
cli.command("migration <name>").action(handleMigration)

cli.on('command:*', function () {
  console.error('Invalid command: %s', cli.args[0]);
  cli.outputHelp()
  process.exit(1);
});

cli.parse(process.argv)
