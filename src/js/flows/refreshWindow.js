/* @flow */
import type {Thunk} from "../state/types"
import rpc from "../electron/rpc"
import unload from "./unload"

export default (): Thunk => (dispatch) => {
  rpc.log("refreshing window")
  dispatch(unload())
}
