import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export const globalDispatch = (action: Object, winId?: string) => {
  return invoke(ipc.globalStore.dispatch(action, winId))
}
