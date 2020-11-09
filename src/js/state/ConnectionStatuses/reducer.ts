import {ConnectionStatusesAction, ConnectionStatusesState} from "./types"
import produce from "immer"

const init = (): ConnectionStatusesState => {
  return {}
}

export default produce(
  (draft: ConnectionStatusesState, action: ConnectionStatusesAction) => {
    switch (action.type) {
      case "CONNECTION_STATUSES_SET":
        draft[action.connId] = action.status
        return
      case "CONNECTION_STATUSES_REMOVE":
        delete draft[action.connId]
        return
    }
  },
  init()
)
