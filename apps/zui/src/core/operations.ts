import {ipcMain, IpcMainInvokeEvent} from "electron"
import {OperationName} from "src/domain/messages"
import {MainObject} from "./main/main-object"

type OperationContext = {
  main: MainObject
  event?: IpcMainInvokeEvent | null
}

let context: OperationContext | null = null

export function setOperationContext(ctx: OperationContext) {
  context = ctx
}

export function createOperation<
  K extends OperationName,
  Args extends any[],
  Ret
>(channel: K, operation: (context: OperationContext, ...args: Args) => Ret) {
  function run(...args: Args) {
    return operation(context, ...args)
  }

  ipcMain.removeHandler(channel)
  ipcMain.handle(channel, (event, ...args: Args) => {
    return operation({...context, event}, ...args)
  })

  return run
}
