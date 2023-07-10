import {getAllStates} from "./utils/getTestState"

export function removeLakeFromUrl(pathname: string) {
  if (/^\/lakes\/.*\/?/.test(pathname)) {
    // Remove the lake segments from the url
    return "/" + pathname.split("/").slice(3).join("/")
  } else {
    return pathname
  }
}

export default function migrateUrls(state: any) {
  for (const window of getAllStates(state)) {
    const histories = window.tabHistories
    if (!histories) continue

    for (const id in histories.entities) {
      const urls = histories.entities[id].entries
      histories.entities[id].entries = urls.map(removeLakeFromUrl)
    }
  }
  return state
}
