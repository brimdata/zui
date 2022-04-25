import {configureStore} from "@reduxjs/toolkit"
import {enableMapSet} from "immer"
import BrimApi from "../api"
import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {globalDispatchMiddleware} from "../state/GlobalContext"
import rootReducer from "../state/rootReducer"

enableMapSet()

function getInitialState(windowId) {
  return Promise.all([
    invoke(ipc.windows.initialState(windowId)),
    invoke(ipc.globalStore.init()).then(({initialState}) => initialState),
  ]).then(([winState, globalState]) => ({...winState, ...globalState}))
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
