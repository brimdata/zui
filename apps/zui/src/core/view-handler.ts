import {Dispatch, State, Store} from "src/js/state/types"
import {ipc} from "src/modules/bullet/view"

type Selector = (state: State, ...args: any) => any

export class ViewHandler {
  static store: Store

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
}
