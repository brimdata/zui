import {AnyAction} from "@reduxjs/toolkit"
import {createOperation} from "../operations"

export const dispatchGlobalOp = createOperation(
  "dispatchGlobal",
  (main, e, action: AnyAction) => {
    main.store.dispatch(action)
    for (const win of main.windows.all) {
      // Don't send it back to the sender, their store will have already been updated.
      if (!win.ref.isDestroyed() && e.sender !== win.ref.webContents) {
        win.ref.webContents.send("globalStore:dispatch", {
          action: {...action, remote: true},
        })
      }
    }
  }
)
