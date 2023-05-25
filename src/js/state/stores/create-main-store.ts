import {Middleware, configureStore} from "@reduxjs/toolkit"
import rootReducer from "./root-reducer"
import {State} from "../types"
import {shouldForward} from "./ipc-redux-middleware"
import {globalDispatchFromMain} from "src/electron/ops/global-dispatch-op"

/**
 * This goes on the main store and will send actions
 * to all the open windows.
 */
const ipcMainReduxMiddleware: Middleware = (_store) => (next) => (action) => {
  const result = next(action)

  if (shouldForward(action)) {
    globalDispatchFromMain.run(action)
  }

  return result
}

export function createMainStore(initState: Partial<State> | undefined) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initState,
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
  })
}
