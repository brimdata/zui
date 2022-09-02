import {matchPath} from "react-router"
import {IconName} from "../core/icon-temp"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <lake> <pool>
 * and <query> replaced with the actual values.
 */

export const root = {
  path: "/",
  title: "Brim",
}
export const lakeList = {
  path: "/lakes",
  title: "Choose a Lake",
}
export const lakeShow = {
  title: "Lake: <lake>",
  path: `${lakeList.path}/:lakeId`,
}
export const lakeImport = {
  title: "New Pool",
  path: `${lakeShow.path}/import`,
  icon: "pool",
}

export const poolShow = {
  title: "<pool>",
  path: `${lakeShow.path}/pools/:poolId`,
  icon: "pool",
}

export const query = {
  title: "<query>",
  path: `${lakeShow.path}/queries/:queryId`,
  icon: "query",
}
export const queryVersion = {
  title: "<query>",
  path: `${query.path}/versions/:version`,
  icon: "query",
}
export const lakeReleaseNotes: Route = {
  title: "Release Notes",
  path: `${lakeShow.path}/release-notes`,
  icon: "doc-plain",
}

export const releaseNotes = {
  title: "Release Notes",
  path: "/release-notes",
}
export const lakeWelcome: Route = {
  title: "Welcome to Zui",
  path: `${lakeShow.path}/welcome`,
  icon: "zui",
}
export const welcome = {
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
  lakeWelcome,
  lakeReleaseNotes,
  lakeImport,
  lakeShow,
  lakeList,
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
