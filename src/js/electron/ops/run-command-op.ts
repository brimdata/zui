import {isString} from "lodash"
import {Command} from "src/app/commands/command"
import {createOperation} from "../operations"

export const runCommandOp = createOperation(
  "runCommand",
  async ({main}, id: string | Command<any, any>, ...args: any[]) => {
    const win = main.windows.byName("search")[0]
    const sendMessage = () => {
      win.ref.webContents.send("runCommand", getId(id), ...args)
    }

    if (win) {
      win.ref.focus()
      sendMessage()
    } else {
      const newWin = await main.windows.create("search")
      newWin.ref.webContents.once("did-finish-load", sendMessage)
    }
  }
)

function getId(idOrCmd: string | Command<any, any>) {
  if (isString(idOrCmd)) return idOrCmd
  else return idOrCmd.id
}
