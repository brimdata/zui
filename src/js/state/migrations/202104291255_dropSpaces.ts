import {
  getAllStates,
  getAllTabs
} from "src/js/state/migrations/utils/getTestState"

export default function dropSpaces(state: any) {
  // Default search records to "events"
  for (const s of getAllStates(state)) {
    delete s.spaces
  }
  for (const tab of getAllTabs(state)) {
    tab.layout.sidebarSections.forEach((section) => {
      if (section.id === "spaces") section.id = "pools"
    })
  }
  return state
}
