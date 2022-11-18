import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./root-reducer"
import {State} from "../types"
import {ipcMainReduxMiddleware} from "./ipc-redux-middleware"

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
