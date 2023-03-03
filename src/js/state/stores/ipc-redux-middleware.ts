import {AnyAction, Middleware} from "@reduxjs/toolkit"
import {
  globalDispatchFromMain,
  globalDispatchFromWindow,
} from "src/js/electron/ops/global-dispatch-op"

/**
 * This goes on the window store and will send actions
 * to the main store and other windows.
 */
export const ipcRendererReduxMiddleware: Middleware =
  (_store) => (next) => (action) => {
    const result = next(action)

    if (shouldForward(action)) {
      globalDispatchFromWindow.invoke(action).catch((e) => {
        console.error(e)
      })
    }

    return result
  }

/**
 * This goes on the main store and will send actions
 * to all the open windows.
 */
export const ipcMainReduxMiddleware: Middleware =
  (_store) => (next) => (action) => {
    const result = next(action)

    if (shouldForward(action)) {
      globalDispatchFromMain.run(action)
    }

    return result
  }

/**
 * A global action starts with a $
 */
const isGlobalAction = (action: AnyAction) => action.type.startsWith("$")
const shouldForward = (action: AnyAction) =>
  isGlobalAction(action) && !action.remote
/* {remote: true} means this was already sent to you from elsewhere */
