/* @flow */
import {createSelectorHook} from "react-redux"
import React from "react"

import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

const GlobalContext = React.createContext<*>(null)

export const useGlobalSelector = createSelectorHook(GlobalContext)
export const useGlobalDispatch = () => (action: *) =>
  invoke(ipc.globalStore.dispatch(action))

export default GlobalContext
