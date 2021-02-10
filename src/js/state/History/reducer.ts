import {SearchRecord} from "src/js/types"
import {HistoryAction, HistoryState} from "./types"
import History from "app/core/models/history"

const init: HistoryState = {
  position: 0,
  entries: []
}

export default function reducer(
  state: HistoryState = init,
  action: HistoryAction
): HistoryState {
  let history: History<SearchRecord>

  switch (action.type) {
    case "HISTORY_CLEAR":
      return {...init}

    case "HISTORY_PUSH":
      history = History.parse(state)
      history.push(action.entry)
      return history.serialize()

    case "HISTORY_BACK":
      history = History.parse(state)
      history.back()
      return history.serialize()

    case "HISTORY_FORWARD":
      history = History.parse(state)
      history.forward()
      return history.serialize()

    case "HISTORY_UPDATE":
      history = History.parse(state)
      history.update({scrollPos: action.scrollPos})
      return history.serialize()

    default:
      return state
  }
}
