import {getAllRendererStates, getAllTabs} from "./utils/getTestState"

export default function moveSecondarySidebarState(state: any) {
  for (const renderer of getAllRendererStates(state)) {
    // Find the active tab for the window
    // Use it's width and openness for the Appearance state
    const lakeId = renderer.window.lakeId
    if (!lakeId) continue
    const tabs = renderer.window.tabs[lakeId]
    if (!tabs) continue
    const active = tabs.data.find((t) => t.id == tabs.active)
    if (!active) continue

    renderer.appearance.secondarySidebarIsOpen =
      active.layout.rightSidebarIsOpen

    renderer.appearance.secondarySidebarWidth = active.layout.rightSidebarWidth
  }

  for (const tab of getAllTabs(state)) {
    delete tab.layout.rightSidebarIsOpen
    delete tab.layout.rightSidebarWidth
  }

  return state
}
