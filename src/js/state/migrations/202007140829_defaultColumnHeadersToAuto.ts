import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function defaultColumnHeadersToAuto(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      // default to AUTO, the existing behavior
      tab.layout.columnHeadersView = "AUTO"
    }
  }

  return state
}
