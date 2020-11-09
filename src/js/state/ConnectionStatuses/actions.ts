import {ConnectionStatus} from "./types"

export default {
  set(connId: string, status: ConnectionStatus) {
    return {type: "CONNECTION_STATUSES_SET", connId, status}
  },
  remove(connId: string) {
    return {type: "CONNECTION_STATUSES_REMOVE", connId}
  }
}
