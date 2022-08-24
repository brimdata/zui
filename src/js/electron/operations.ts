import {ipcMain, IpcMainInvokeEvent, ipcRenderer} from "electron"
import log from "electron-log"
import {BrimMain} from "./brim"

export function createOperation<Arg = never, Ret = never>(
  channel: string,
  handler: (main: BrimMain, e: IpcMainInvokeEvent, arg: Arg) => Ret
) {
  return new Operation<Arg, Ret>(channel, handler)
}

export function createSpecialOperation<Arg, Ret>(channel: string) {
  return new SpecialOperation<Arg, Ret>(channel)
}

export class Operation<Arg, Ret> {
  context: BrimMain | null

  constructor(
    public channel: string,
    private handler: (
      main: BrimMain,
      e: IpcMainInvokeEvent | null,
      arg: Arg
    ) => Ret
  ) {}

  listen(main: BrimMain) {
    this.context = main
    ipcMain.handle(this.channel, (event, arg) => {
      log.debug("IPC Handling:", this.channel)
      return this.handler(main, event, arg)
    })
    log.debug("IPC Listening:", this.channel)
  }

  invoke(...args: Arg extends never ? [] : [arg: Arg]): Promise<Ret> {
    if (ipcRenderer) {
      return ipcRenderer.invoke(this.channel, args[0])
    } else {
      throw new Error("You must call operation.run() in the main process")
    }
  }

  run(...args: Arg extends never ? [] : [arg: Arg]): Ret {
    return this.handler(this.context, null, args[0])
  }
}

class OpResponse<A, R> {
  constructor(public value: R, public condition = (_arg: A) => true) {}

  when(condition: (arg: A) => boolean) {
    this.condition = condition
  }
}

export class SpecialOperation<A, R> {
  responses: OpResponse<A, R>[] = []

  constructor(public channel: string) {}

  return(value: R) {
    const res = new OpResponse<A, R>(value)
    this.responses.push(res)
    return res
  }

  listen() {
    ipcMain.handle(this.channel, (e, arg: A) => {
      log.debug("IPC Handling:", this.channel)
      const index = this.responses.findIndex((r) => r.condition(arg))
      if (index === -1) return
      const res = this.responses[index]
      this.responses.splice(index, 1)
      return res.value
    })
    log.debug("IPC Listening:", this.channel)
  }

  invoke(arg: A): Promise<R> {
    return ipcRenderer.invoke(this.channel, arg)
  }
}
