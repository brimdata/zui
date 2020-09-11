import {Thunk} from "../state/types"
import confirmUnload from "./confirmUnload"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import rpc from "../electron/rpc"
import unload from "./unload"

export default (): Thunk => (dispatch) => {
  rpc.log("Confirming Unload...")
  dispatch(confirmUnload()).then(() => {
    rpc.log("Unloading")
    dispatch(unload()).then(() => {
      rpc.log("Destroying window")
      invoke(ipc.windows.destroy())
    })
  })
}
