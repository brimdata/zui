import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addScrollXyToViewer(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      t.viewer.scrollX = 0
      t.viewer.scrollY = 0
    }
  }

  return state
}
