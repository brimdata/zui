import {configureStore} from "@reduxjs/toolkit"
import {State, ThunkExtraArg} from "../types"
import {ipcRendererReduxMiddleware} from "./ipc-redux-middleware"
import rootReducer from "./root-reducer"

export function createWindowStore(
  initialState: State,
  extraArgument: ThunkExtraArg
) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaults) => {
      const defaults = getDefaults({
        thunk: {extraArgument},
        serializableCheck: false,
        immutableCheck: false,
      })
      return defaults.concat(ipcRendererReduxMiddleware)
    },
  })
}
