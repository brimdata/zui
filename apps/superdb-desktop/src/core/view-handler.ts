import {Dispatch, State, Store} from "src/js/state/types"
import {ipc} from "src/modules/bullet/view"
import {invoke} from "./invoke"
import toast from "react-hot-toast"
import {useEffect} from "react"

type Selector = (state: State, ...args: any) => any

export class ViewHandler {
  static store: Store
  static invoke = invoke
  protected invoke = invoke
  protected toast = toast

  protected get store() {
    return ViewHandler.store
  }

  protected dispatch(action: Parameters<Dispatch>[0]) {
    return this.store.dispatch(action)
  }

  protected select<T extends Selector>(selector: T): ReturnType<T> {
    return selector(this.store.getState())
  }

  protected request(path: string, params?: object) {
    return ipc.request(path, params)
  }

  protected listen(eventMap: Record<string, any>) {
    useEffect(() => {
      const offs = []
      for (const [event, handler] of Object.entries(eventMap)) {
        offs.push(
          global.zui?.on(event, (_event, ...args: any[]) => handler(...args))
        )
      }

      return () => {
        offs.forEach((off) => off())
      }
    })
  }
}
