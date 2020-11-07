import {State} from "../types"
import {ConnectionStatus} from "./types"

export default {
  get: (connId: string) => (state: State): ConnectionStatus | void => {
    return state.connectionStatuses[connId]
  }
}
