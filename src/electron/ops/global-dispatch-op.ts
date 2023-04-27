import {AnyAction} from "@reduxjs/toolkit"
import {createOperation} from "../../core/operations"
import {ZuiWindow} from "../windows/zui-window"

export const globalDispatchFromWindow = createOperation(
  "dispatchGlobalFromWindow",
  ({main, event}, action: AnyAction) => {
    main.store.dispatch({...action, remote: true})
    main.windows.all
      .filter((win) => win.ref.webContents !== event.sender)
      .forEach((win) => dispatchToWindow(win, action))
  }
)

export const globalDispatchFromMain = createOperation(
  "dispatchFromMain",
  ({main}, action: AnyAction) => {
    main.windows.all.forEach((win) => dispatchToWindow(win, action))
  }
)

function dispatchToWindow(win: ZuiWindow, action: AnyAction) {
  win.send("globalStore:dispatch", {
    action: {...action, remote: true},
  })
}
