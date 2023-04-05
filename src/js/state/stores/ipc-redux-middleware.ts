import {AnyAction, Middleware} from "@reduxjs/toolkit"

/**
 * This goes on the window store and will send actions
 * to the main store and other windows.
 */
export const ipcRendererReduxMiddleware: Middleware =
  (_store) => (next) => (action) => {
    const result = next(action)

    if (shouldForward(action)) {
      global.zui
        .invoke("dispatchGlobalFromWindow", action)
        .catch((e) => console.error(e))
    }

    return result
  }

/**
 * A global action starts with a $
 */
export const isGlobalAction = (action: AnyAction) => action.type.startsWith("$")
export const shouldForward = (action: AnyAction) =>
  isGlobalAction(action) && !action.remote
/* {remote: true} means this was already sent to you from elsewhere */
