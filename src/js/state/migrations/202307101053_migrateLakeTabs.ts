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
/**
 * Move all the saved tabs into the new window tabs area
 */
function migrateWindowTabsUnderLake(state: any) {
  for (const renderer of getAllRendererStates(state)) {
    const lakeId = renderer.window.lakeId // from above
    renderer.window.tabs = {[lakeId]: renderer.tabs}
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
