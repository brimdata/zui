import {ipcRenderer} from "electron"

import {Thunk} from "../state/types"
import getPersistable from "../state/getPersistable"
import rpc from "../electron/rpc"

export default (): Thunk => (_, getState) => {
  rpc.log("Saving window state")
  return ipcRenderer
    .invoke("windows:saveState", global.windowId, getPersistable(getState()))
    .then(() => rpc.log("Window state saved"))
}
