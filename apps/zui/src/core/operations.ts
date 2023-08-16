import {ipcMain, IpcMainInvokeEvent} from "electron"
import log from "electron-log"
import {OperationName, Operations} from "src/domain/messages"
import {MainObject} from "./main/main-object"

export function createOperation<K extends OperationName>(
  channel: K,
  handler: (
    context: OperationContext,
    ...args: Parameters<Operations[K]>
  ) => Promise<ReturnType<Operations[K]>> | ReturnType<Operations[K]>
) {
  return new Operation(channel, handler)
}

type OperationContext = {
  main: MainObject
  event: IpcMainInvokeEvent | null
}

export class Operation<Args extends any[], Ret> {
  private main: MainObject | null

  constructor(
    public channel: string,
    private handler: (context: OperationContext, ...args: Args) => Ret
  ) {}

  listen(main: MainObject) {
    this.main = main
    ipcMain.removeHandler(this.channel)

    ipcMain.handle(this.channel, (event, ...args: Args) => {
      log.debug("IPC Handling:", this.channel)
      return this.handler({main, event}, ...args)
    })
    log.debug("IPC Listening:", this.channel)
  }

  run(...args: Args): Ret {
    return this.handler({main: this.main, event: null}, ...args)
  }
}
