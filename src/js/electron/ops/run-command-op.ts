import log from "electron-log"
import {isString} from "lodash"
import {Command} from "src/app/commands/command"
import {createOperation} from "../../../core/operations"

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
      try {
        const newWin = await main.windows.create("search")
        newWin.ref.webContents.once("did-finish-load", sendMessage)
      } catch (e) {
        log.error("command failed because search window failed to open")
      }
    }
  }
)

function getId(idOrCmd: string | Command<any, any>) {
  if (isString(idOrCmd)) return idOrCmd
  else return idOrCmd.id
}
