import produce from "immer"

export default function getPersistable(state: any) {
  return produce(state, (draft) => {
    delete draft.errors
    delete draft.notice
    delete draft.handlers
    delete draft.spaces

    for (const tab of draft.tabs.data) {
      delete tab.viewer
      delete tab.chart
      delete tab.last
      delete tab.logDetails
    }
  })
}
