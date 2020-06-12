/* @flow */
import React from "react"

import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

const GlobalContext = React.createContext<*>(null)

export const globalDispatch = (action: Object) => {
  return invoke(ipc.globalStore.dispatch(action))
}

export default GlobalContext
