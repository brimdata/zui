import {configureStore} from "@reduxjs/toolkit"
import BrimApi from "src/js/api"
import initGlobals from "src/js/initializers/initGlobals"
import rootReducer from "src/js/state/stores/root-reducer"
import {Action, State, Store} from "src/js/state/types"

export type TestStore = {
  dispatchAll: Function
  getActions: Function
  getActionTypes: Function
  clearActions: Function
} & Store

export default (api: BrimApi = new BrimApi()): TestStore => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {api},
        },
        serializableCheck: false,
        immutableCheck: false,
      }),
    enhancers: (defaultEnhancers) => [applyDispatchAll(), ...defaultEnhancers],
  }) as any
  initGlobals(store)
  return store
}

function applyDispatchAll() {
  return (createStore) =>
    (...args) => {
      const store = createStore(...args)

      const dispatchAll = (actions: Action[]): State => {
        actions.forEach(store.dispatch)
        return store.getState()
      }

      return {
        ...store,
        dispatchAll,
      }
    }
}
