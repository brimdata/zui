import {ipcMain, IpcMainInvokeEvent, ipcRenderer} from "electron"
import log from "electron-log"
import {BrimMain} from "./brim"

export function createOperation<Args extends any[] = never[], Ret = never>(
  channel: string,
  handler: (context: OperationContext, ...args: Args) => Ret
) {
  return new Operation<Args, Ret>(channel, handler)
}

type OperationContext = {
  main: BrimMain
  event: IpcMainInvokeEvent | null
}

export class Operation<Args extends any[], Ret> {
  private main: BrimMain | null

  constructor(
    public channel: string,
    private handler: (context: OperationContext, ...args: Args) => Ret
  ) {}

  listen(main: BrimMain) {
    this.main = main
    ipcMain.handle(this.channel, (event, ...args: Args) => {
      log.debug("IPC Handling:", this.channel)
      return this.handler({main, event}, ...args)
    })
    log.debug("IPC Listening:", this.channel)
  }

  invoke(...args: Args): Promise<Ret> {
    if (ipcRenderer) {
      return ipcRenderer.invoke(this.channel, ...args)
    } else {
      throw new Error("You must call operation.run() in the main process")
    }
  }

  run(...args: Args): Ret {
    return this.handler({main: this.main, event: null}, ...args)
  }
}
