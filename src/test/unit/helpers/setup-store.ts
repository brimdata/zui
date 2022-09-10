import BrimApi from "src/js/api"
import {createWindowStore} from "src/js/state/stores/create-window-store"
import {AppDispatch, GetState} from "src/js/state/types"

export function setupStore() {
  const store = createWindowStore(undefined, {api: new BrimApi()})
  return {
    store,
    dispatch: store.dispatch as AppDispatch,
    getState: store.getState as GetState,
    select: <T extends (...args: any[]) => any>(selector: T): ReturnType<T> =>
      selector(store.getState()),
  }
}
