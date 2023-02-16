import {isObject} from "lodash"
import {getAllStates, getAllTabs} from "./utils/getTestState"

export default function addLayoutDefaults(state: any) {
  for (const tab of getAllTabs(state)) {
    // Add some defaults to layout
    tab.layout.currentPaneName = tab.layout.currentPaneName ?? "history"
    tab.layout.isEditingTitle = tab.layout.isEditingTitle ?? false
    tab.layout.titleFormAction = tab.layout.titleFormAction ?? "create"
    tab.layout.showHistogram = tab.layout.showHistogram ?? true
  }

  for (const s of getAllStates(state)) {
    if (!s.appearance || !isObject(s.appearance)) continue
    // Add some defaults to appearance
    s.appearance.poolsOpenState = s.appearance.poolsOpenState ?? {}
    s.appearance.queriesOpenState = s.appearance.queriesOpenState ?? {}
    // Remove sidebar sections
    delete s.appearance.sidebarSections
  }

  return state
}
