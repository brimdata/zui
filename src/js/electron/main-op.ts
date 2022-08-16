import {ipcMain, IpcMainInvokeEvent, ipcRenderer} from "electron"
import log from "electron-log"
import {BrimMain} from "./brim"

export function mainOp<Arg = never, Ret = never>(
  channel: string,
  handler: (main: BrimMain, e: IpcMainInvokeEvent, arg: Arg) => Ret
) {
  return new MainOperation<Arg, Ret>(channel, handler)
}

export class MainOperation<Arg, Ret> {
  constructor(
    public channel: string,
    private handler: (main: BrimMain, e: IpcMainInvokeEvent, arg: Arg) => Ret
  ) {}

  listen(main: BrimMain) {
    ipcMain.handle(this.channel, (event, arg) => {
      log.info("IPC Handling:", this.channel)
      return this.handler(main, event, arg)
    })
    log.debug("IPC Listening:", this.channel)
  }

  invoke(...args: Arg extends never ? [] : [arg: Arg]): Promise<Ret> {
    return ipcRenderer.invoke(this.channel, args)
  }
}
