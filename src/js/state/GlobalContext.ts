import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export const globalDispatch = (action: Object) => {
  return invoke(ipc.globalStore.dispatch(action))
}
