import {ipcMain, IpcMainInvokeEvent} from "electron"
import {OperationName} from "src/domain/messages"
import {MainObject} from "./main/main-object"
import {Dispatch} from "src/js/state/types"
import {select} from "./main/select"

type OperationContext = {
  dispatch: Dispatch
  main: MainObject
  event?: IpcMainInvokeEvent | null
  select: typeof select
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
