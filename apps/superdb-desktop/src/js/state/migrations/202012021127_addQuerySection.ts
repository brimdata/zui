import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addQuerySection(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      tab.layout.sidebarSections.splice(1, 0, {id: "queries"})
    }
  }

  return state
}
