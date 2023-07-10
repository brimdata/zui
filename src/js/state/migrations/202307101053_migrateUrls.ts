import {getAllWindowStates} from "./utils/getTestState"

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

export default function migrateUrls(state: any) {
  // set the current window lakeId to the most recent tab's lake id
  for (const window of getAllWindowStates(state)) {
    const history = window.tabHistories.entities[window.tabs.active]
    // If there is no active tab with history
    if (!history) continue

    for (let pathname of history.entries) {
      // Get the lakeId from the pathnames in the active tab,
      // As soon as you find one, break for this window
      const lakeId = getLakeId(pathname)
      if (lakeId) {
        window.current = {lakeId}
        break
      }
    }
  }

  // Rewrite all the urls without the lake prefix
  for (const window of getAllWindowStates(state)) {
    const histories = window.tabHistories

    for (const id in histories.entities) {
      const urls = histories.entities[id].entries
      histories.entities[id].entries = urls.map(removeLakeFromUrl)
    }
  }

  return state
}
