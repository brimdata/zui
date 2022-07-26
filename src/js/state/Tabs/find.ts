import {matchPath} from "react-router"
import {queryVersion} from "src/app/router/routes"

export function findTabByUrl(tabs, url) {
  return tabs.find((tab) => {
    return global.tabHistories.getOrCreate(tab.id).location.pathname === url
  })
}

export function findTabById(tabs, id) {
  return tabs.find((tab) => tab.id === id)
}

export function findQuerySessionTab(tabs) {
  return tabs.find((tab) => {
    const pathname = global.tabHistories.getOrCreate(tab.id).location.pathname
    const match = matchPath(pathname, {path: queryVersion.path, exact: true})
    return !!match
  })
}
