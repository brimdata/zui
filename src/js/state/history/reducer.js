/* @flow */

import type {HistoryAction, HistoryState} from "./types"
import brim from "../../brim"

const init: HistoryState = {
  position: -1,
  entries: []
}

export default function reducer(
  state: HistoryState = init,
  action: HistoryAction
): HistoryState {
  switch (action.type) {
    case "HISTORY_CLEAR":
      return {...init}

    case "HISTORY_PUSH":
      return brim
        .entries(state)
        .push(action.entry)
        .data()

    case "HISTORY_BACK":
      return brim
        .entries(state)
        .goBack()
        .data()

    case "HISTORY_FORWARD":
      return brim
        .entries(state)
        .goForward()
        .data()

    default:
      return state
  }
}
