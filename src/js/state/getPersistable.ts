import produce from "immer"
import {State} from "./types"

export default function getPersistable(state: State) {
  return produce(state, (draft: State) => {
    delete draft.errors
    delete draft.notice
    delete draft.handlers
    delete draft.systemTest
    delete draft.workspaceStatuses

    for (const tab of draft.tabs.data) {
      delete tab.viewer
      delete tab.chart
      delete tab.last
      delete tab.logDetails
    }
  })
}
