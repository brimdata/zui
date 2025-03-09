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
}

export const poolShow: Route = {
  name: "poolShow",
  path: `/pools/:poolId`,
  icon: "pool",
}

export const snapshotShow: Route = {
  name: "snapshot",
  path: "/snapshots/:id",
  icon: "query",
}

export const releaseNotes: Route = {
  name: "releaseNotes",
  path: `/release-notes`,
  icon: "doc_plain",
}

export const welcome: Route = {
  name: "welcome",
  path: "/welcome",
  icon: "zui",
}

type Route = {
  name: string
  path: string
  icon?: IconName
}

export const allRoutes: Route[] = [
  poolShow,
  snapshotShow,
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
