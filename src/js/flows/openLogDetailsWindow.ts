import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import {mustGetConnection} from "../state/Current/selectors"
import {Thunk} from "../state/types"

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  const {host, port} = mustGetConnection(getState())
  invoke(
    ipc.windows.open(
      "detail",
      {size: [700, 600], query: {host, port}},
      getState()
    )
  )
}
