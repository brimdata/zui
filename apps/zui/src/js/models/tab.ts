import {whichRoute} from "src/app/router/routes"
import get from "lodash/get"
import {PoolsState} from "../state/Pools/types"
import {LakesState} from "../state/Lakes/types"

export default function (
  tabId: string,
  lakes: LakesState,
  pools: PoolsState,
  queryIdNameMap: any,
  lakeId: string
) {
  const history = global.tabHistories.getOrCreate(tabId)
  const route = whichRoute(history.location.pathname)
  return {
    title() {
      if (route) {
        return compileTitle(
          route,
          history.location,
          lakes,
          pools,
          queryIdNameMap,
          lakeId
        )
      } else {
        return "Zui"
      }
    },
    icon() {
      return route?.icon
    },
  }
}

/**
 * Replaces keywords like <lake> <pool> <query> with the
 * actual names of the current lake pool and query name.
 */
function compileTitle(route, location, lakes, pools, queryIdNameMap, lakeId) {
  let title = route.title
  const {queryId, poolId, version} = route.match.params
  title = title.replace("<lake>", get(lakes, [lakeId, "name"], ""))
  if (poolId) {
    title = title.replace(
      "<pool>",
      get(pools, [lakeId, poolId, "data", "name"], "Not Found")
    )
  }
  if (queryId) {
    title = title.replace("<query>", queryIdNameMap[queryId] || "Query Page")
  }
  if (version) {
    title = title.replace("<version>", version)
  }
  return title
}
