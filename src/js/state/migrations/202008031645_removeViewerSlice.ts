import {getAllStates} from "../../test/helpers/getTestState"

export default function removeViewerSlice(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      delete t.viewer
      delete t.chart
    }
  }
  return state
}
