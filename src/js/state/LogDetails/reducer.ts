import {LogDetails, LogDetailsAction, LogDetailsState} from "./types"
import History from "src/app/core/models/history"

const init = (): LogDetailsState => ({
  entries: [],
  position: 0
})

export default function reducer(
  state: LogDetailsState = init(),
  action: LogDetailsAction
): LogDetailsState {
  let history: History<LogDetails>
  switch (action.type) {
    case "LOG_DETAIL_PUSH":
      history = toHistory(state)
      history.push({
        log: action.record,
        uidLogs: [],
        uidStatus: "INIT"
      })
      return history.serialize()
    case "LOG_DETAIL_UPDATE":
      history = toHistory(state)
      history.update(action.updates)
      return history.serialize()

    case "LOG_DETAIL_FORWARD":
      history = toHistory(state)
      history.forward()
      return history.serialize()

    case "LOG_DETAIL_BACK":
      history = toHistory(state)
      history.back()
      return history.serialize()

    case "LOG_DETAIL_CLEAR":
      return init()

    default:
      return state
  }
}

export type LogDetailHistory = History<LogDetails>
export const toHistory = ({
  entries,
  position
}: LogDetailsState): LogDetailHistory => {
  return new History<LogDetails>([...entries], position)
}
