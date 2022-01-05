import {createZealot} from "zealot-old"
import {globalDispatchMiddleware} from "../state/GlobalContext"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import rootReducer from "../state/rootReducer"
import {configureStore} from "@reduxjs/toolkit"
import BrimApi from "../api"
import {enableMapSet} from "immer"

enableMapSet()

function getInitialState(windowId) {
  return Promise.all([
    invoke(ipc.windows.initialState(windowId)),
    invoke(ipc.globalStore.init()).then(({initialState}) => initialState)
  ]).then(([winState, globalState]) => ({...winState, ...globalState}))
}

export default async (api: BrimApi) => {
  const windowId = getUrlSearchParams().id
  const initialState = await getInitialState(windowId)
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaults) => [
      ...getDefaults({
        thunk: {
          extraArgument: {createZealot, api}
        },
        serializableCheck: false,
        immutableCheck: false
      }),
      globalDispatchMiddleware
    ]
  })
}
