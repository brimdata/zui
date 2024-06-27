import {matchPath} from "react-router"
import {IconName} from "../../components/icon"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <lake> <pool>
 * and <query> replaced with the actual values.
 */

export const root: Route = {
  name: "root",
  path: "/",
  title: "Zui",
}

export const poolShow: Route = {
  name: "poolShow",
  title: "<pool>",
  path: `/pools/:poolId`,
  icon: "pool",
}

export const query: Route = {
  name: "querySession",
  title: "<query>",
  path: `/queries/:queryId`,
  icon: "query",
}

export const queryVersion: Route = {
  name: "querySession",
  title: "<query>",
  path: `${query.path}/versions/:version`,
  icon: "query",
}
export const releaseNotes: Route = {
  name: "releaseNotes",
  title: "Release Notes",
  path: `/release-notes`,
  icon: "doc_plain",
}

export const welcome: Route = {
  name: "welcome",
  title: "Welcome to Zui",
  path: "/welcome",
  icon: "zui",
}

type Route = {
  name: string
  title: string
  path: string
  icon?: IconName
}

export const allRoutes: Route[] = [
  poolShow,
  query,
  queryVersion,
  releaseNotes,
  welcome,
  root,
]

export function whichRoute(pathname: string) {
  for (const route of allRoutes) {
    const match = matchPath(pathname, {path: route.path, exact: true})
    if (match) return {...route, match}
  }
  return null
}
