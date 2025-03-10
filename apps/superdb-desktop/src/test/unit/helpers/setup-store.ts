import ZuiApi from "src/js/api/zui-api"
import {createWindowStore} from "src/js/state/stores/create-window-store"
import {AppDispatch, GetState} from "src/js/state/types"

export function setupStore() {
  const store = createWindowStore(undefined, {api: new ZuiApi()})
  return {
    store,
    dispatch: store.dispatch as AppDispatch,
    getState: store.getState as GetState,
    select: <T extends (...args: any[]) => any>(selector: T): ReturnType<T> =>
      selector(store.getState()),
  }
}
