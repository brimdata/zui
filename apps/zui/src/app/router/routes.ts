import {matchPath} from "react-router"
import {IconName} from "../core/icon-temp"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <lake> <pool>
 * and <query> replaced with the actual values.
 */

export const root: Route = {
  path: "/",
  title: "Zui",
}

export const poolShow: Route = {
  title: "<pool>",
  path: `/pools/:poolId`,
  icon: "pool",
}

export const poolNew: Route = {
  title: "New Pool",
  path: `/pools/new`,
  icon: "pool",
}

export const query: Route = {
  title: "<query>",
  path: `/queries/:queryId`,
  icon: "query",
}
export const queryVersion: Route = {
  title: "<query>",
  path: `${query.path}/versions/:version`,
  icon: "query",
}
export const lakeReleaseNotes: Route = {
  title: "Release Notes",
  path: `/release-notes`,
  icon: "doc-plain",
}

export const releaseNotes: Route = {
  title: "Release Notes",
  path: "/release-notes",
}

export const welcome: Route = {
  title: "Welcome to Zui",
  path: "/welcome",
  icon: "zui",
}

type Route = {
  title: string
  path: string
  icon?: IconName
}

export const allRoutes: Route[] = [
  lakeReleaseNotes,
  poolNew,
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
