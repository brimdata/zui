import {matchPath} from "react-router"
import {query, queryVersion} from "src/app/router/routes"

export function findTabByUrl(tabs, url) {
  type Params = {queryId?: string; version?: string}
  const queryMatch = matchPath<Params>(url, [queryVersion.path, query.path])
  return tabs.find((tab) => {
    if (queryMatch) {
      const tabQueryMatch = matchPath<Params>(
        global.tabHistories.getOrCreate(tab.id).location.pathname,
        [queryVersion.path, query.path]
      )
      return tabQueryMatch?.params.queryId === queryMatch.params.queryId
    }

    return global.tabHistories.getOrCreate(tab.id).location.pathname === url
  })
}

export function findTabById(tabs, id) {
  return tabs.find((tab) => tab.id === id)
}
