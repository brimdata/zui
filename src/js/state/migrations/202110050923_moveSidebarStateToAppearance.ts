import {getAllStates, getAllTabs} from "./utils/getTestState"

export default function moveSidebarStateToAppearance(state: any) {
  // Get the first active tab we find
  let firstActiveTab
  for (let window of getAllStates(state)) {
    if (!window.tabs) continue
    const tab = window.tabs.data.find((tab) => tab.id === window.tabs.active)
    if (tab) {
      firstActiveTab = tab
      break
    }
  }

  // If there is one, populate the appearance state from it
  let appearance = undefined
  if (firstActiveTab) {
    appearance = {
      sidebarIsOpen: firstActiveTab.layout.leftSidebarIsOpen,
      sidebarWidth: firstActiveTab.layout.leftSidebarWidth,
      sidebarSections: firstActiveTab.layout.sidebarSections
    }
  }

  // Set the appearance state on the window
  for (let window of getAllStates(state)) {
    window.appearance = appearance
  }

  // Delete the old state
  for (let tab of getAllTabs(state)) {
    delete tab.layout.leftSidebarIsOpen
    delete tab.layout.leftSidebarWidth
    delete tab.layout.sidebarSections
  }

  return state
}
