import {Action, Middleware} from "@reduxjs/toolkit"

/**
 * This goes on the window store and will send actions
 * to the main store and other windows.
 */
export const ipcRendererReduxMiddleware: Middleware =
  (_store) => (next) => (action: Action) => {
    const result = next(action)

    if (shouldForward(action)) {
      global.zui
        .invoke("dispatchGlobalFromWindow", action, global.windowId)
        .catch((e) => console.error(e))
    }

    return result
  }

/**
 * A global action starts with a $
 */
export const isGlobalAction = (action: Action) => action.type.startsWith("$")
export const shouldForward = (action: any) =>
  isGlobalAction(action) && !action.remote
/* {remote: true} means this was already sent to you from elsewhere */
