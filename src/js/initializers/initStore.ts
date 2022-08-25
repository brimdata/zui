import {configureStore} from "@reduxjs/toolkit"
import {enableMapSet} from "immer"
import BrimApi from "../api"
import {getGlobalStateOp} from "../electron/ops/get-global-state-op"
import {getWindowStateOp} from "../electron/ops/get-window-state-op"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {globalDispatchMiddleware} from "../state/GlobalContext"
import rootReducer from "../state/rootReducer"

enableMapSet()

function getInitialState(windowId) {
  return Promise.all([
    getWindowStateOp.invoke(windowId),
    getGlobalStateOp.invoke(),
  ]).then(([winState, globalState]) => {
    return {...winState, ...globalState}
  })
}

export default async (api: BrimApi) => {
  const windowId = getUrlSearchParams().id
  const initialState = await getInitialState(windowId)

  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaults) => {
      const defaults = getDefaults({
        thunk: {
          extraArgument: {api},
        },
        serializableCheck: false,
        immutableCheck: false,
      })
      return defaults.concat(globalDispatchMiddleware)
    },
  })
}
