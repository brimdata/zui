import {createOperation} from "../operations"

export const runCommandOp = createOperation(
  "runCommand",
  async (main, e, arg: {id: string; args?: any[]}) => {
    const win = main.windows.byName("search")[0]
    const sendMessage = () => {
      const commandArgs = arg.args ?? []
      const commandId = arg.id
      win.ref.webContents.send("runCommand", commandId, ...commandArgs)
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
