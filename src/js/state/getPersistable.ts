import produce from "immer"
import {State} from "./types"

export default function getPersistable(state: State) {
  return produce(state, (draft: State) => {
    delete draft.errors
    delete draft.notice
    delete draft.handlers
    delete draft.connectionStatuses
    delete draft.systemTest

    for (const tab of draft.tabs.data) {
      delete tab.viewer
      delete tab.chart
      delete tab.last
      delete tab.logDetails
    }
  })
}
