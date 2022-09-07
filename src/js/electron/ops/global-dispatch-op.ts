import {AnyAction} from "@reduxjs/toolkit"
import {createOperation} from "../operations"
import {ZuiWindow} from "../windows/zui-window"

export const globalDispatchFromWindow = createOperation(
  "dispatchGlobalFromWindow",
  (main, e, action: AnyAction) => {
    main.store.dispatch(action)
    main.windows.all
      .filter((win) => win.ref.webContents === e.sender)
      .forEach((win) => dispatchToWindow(win, action))
  }
)

export const globalDispatchFromMain = createOperation(
  "dispatchFromMain",
  (main, e, action: AnyAction) => {
    main.windows.all.forEach((win) => dispatchToWindow(win, action))
  }
)

function dispatchToWindow(win: ZuiWindow, action: AnyAction) {
  win.send("globalStore:dispatch", {
    action: {...action, remote: true},
  })
}
