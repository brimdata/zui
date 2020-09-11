import {composeWithDevTools} from "redux-devtools-extension"
import {createStore, applyMiddleware} from "redux"
import {createZealot} from "zealot"
import reduxThunk from "redux-thunk"

import {globalDispatch} from "../state/GlobalContext"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import rootReducer from "../state/rootReducer"

function getInitialState(windowId) {
  return Promise.all([
    invoke(ipc.windows.initialState(windowId)),
    invoke(ipc.globalStore.init()).then(({initialState}) => initialState)
  ]).then(([winState, globalState]) => ({...winState, ...globalState}))
}

export default async () => {
  const windowId = getUrlSearchParams().id
  const initialState = await getInitialState(windowId)
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        reduxThunk.withExtraArgument({
          globalDispatch,
          createZealot
        })
      )
    )
  )
}
