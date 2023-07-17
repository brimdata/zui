import {getAllRendererStates} from "./utils/getTestState"

const REGEX = /^\/lakes\/([^/]*)\/?/

export function removeLakeFromUrl(pathname: string) {
  if (REGEX.test(pathname)) {
    // Remove the lake segments from the url
    return "/" + pathname.split("/").slice(3).join("/")
  } else {
    return pathname
  }
}

export function getLakeId(pathname: string) {
  const matches = pathname.match(REGEX)
  return matches[1]
}

/**
 * set the window's lakeId to the most recent tab's lake id
 * */
function migrateWindowLakeId(state: any) {
  for (const renderer of getAllRendererStates(state)) {
    renderer.window = {lakeId: null, tabs: {}}

    const history = renderer.tabHistories?.entities[renderer.tabs.active]
    // If there is no active tab with history
    if (!history) continue

    for (let pathname of history.entries) {
      // Get the lakeId from the pathnames in the active tab,
      // As soon as you find one, break for this window
      const lakeId = getLakeId(pathname)
      if (lakeId) {
        renderer.window.lakeId = lakeId
        break
      }
    }
  }
}

function getAssociatedLakeId(tab, history) {
  if (!history || !history.entries) return null
  const pathname = history.entries[history.index]
  if (!pathname) return null
  return getLakeId(pathname)
}

function emptyTabs() {
  return {
    active: null,
    preview: null,
    data: [],
  }
}

/**
 * Move all the saved tabs into the new window tabs area
  For each tab
  1. Find the associated lake Id
  2. Put that tab in the lake's tab data
  3. Find the associated lake for the active tab, and activate that
  4. Ensure all tabs have one that is active
  5. Delete the old tabs state
 */
function migrateWindowTabsUnderLake(state: any) {
  for (const renderer of getAllRendererStates(state)) {
    const activeTabId = renderer.tabs.active
    const newTabs = {}
    for (const tab of renderer.tabs.data) {
      const history = renderer.tabHistories?.entities[tab.id]
      const lakeId = getAssociatedLakeId(tab, history) ?? renderer.window.lakeId
      if (!lakeId) continue // this tab will be lost

      // Push this tab to its lake's group
      newTabs[lakeId] = newTabs[lakeId] ?? emptyTabs()
      newTabs[lakeId].data.push(tab)

      // If this was the active, migrate that data
      if (tab.id === activeTabId) newTabs[lakeId].active = activeTabId
    }

    // Ensure each set of tabs as an active tab
    for (let lakeId in newTabs) {
      if (!newTabs[lakeId].active) {
        // Set the first tab to be active
        newTabs[lakeId].active = newTabs[lakeId].data[0]?.id
      }
    }
    // Set the new tabs
    renderer.window.tabs = newTabs
    // Delete the old tabs
    delete renderer.tabs
  }
}

/**
 *  Rewrite all the urls without the lake prefix
 */
function migrateTabUrls(state: any) {
  for (const renderer of getAllRendererStates(state)) {
    const histories = renderer.tabHistories
    if (!histories) continue

    for (const id in histories.entities) {
      const urls = histories.entities[id].entries
      histories.entities[id].entries = urls.map(removeLakeFromUrl)
    }
  }
}

export default function migrateLakeTabs(state: any) {
  migrateWindowLakeId(state)
  migrateWindowTabsUnderLake(state)
  migrateTabUrls(state)
  return state
}
