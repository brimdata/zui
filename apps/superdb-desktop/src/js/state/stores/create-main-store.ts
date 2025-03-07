import {Middleware, configureStore} from "@reduxjs/toolkit"
import rootReducer from "./root-reducer"
import {State, Store} from "../types"
import {shouldForward} from "./ipc-redux-middleware"
import {globalDispatchFromMain} from "src/electron/ops/global-dispatch-op"

/**
 * This goes on the main store and will send actions
 * to all the open windows.
 */
const ipcMainReduxMiddleware: Middleware = (_store) => (next) => (action) => {
  const result = next(action)

  if (shouldForward(action as any)) {
    globalDispatchFromMain(action as any)
  }

  return result
}

// The main store has all of the reducers but many of them are not
// used. Only the ones with a $ in front of them should be used
// Some reducers only make sense in terms of a window.
// Maybe we should mark which reducers are global somehow.

export function createMainStore(initState: Partial<State> | undefined) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initState,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => {
      return [
        ...getDefaultMiddleware({
          thunk: true,
          immutableCheck: false,
          serializableCheck: false,
        }),
        ipcMainReduxMiddleware,
      ]
    },
  }) as Store
}
