import {whichRoute} from "src/app/router/routes"
import {decodeSearchParams} from "src/app/search/utils/search-params"
import get from "lodash/get"
import {PoolsState} from "../state/Pools/types"
import {LakesState} from "../state/Lakes/types"

export default function (
  tabId: string,
  lakes: LakesState,
  pools: PoolsState,
  queryIdNameMap: any
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
          queryIdNameMap
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
function compileTitle(route, location, lakes, pools, queryIdNameMap) {
  let title = route.title
  const {lakeId, queryId, poolId, version} = route.match.params
  title = title.replace("<lake>", get(lakes, [lakeId, "name"], ""))
  if (poolId) {
    title = title.replace(
      "<pool>",
      get(pools, [lakeId, poolId, "data", "name"], "")
    )
  }
  if (queryId) {
    title = title.replace("<query>", queryIdNameMap[queryId] || "Query Page")
  }
  if (version) {
    title = title.replace("<version>", version)
  }
  const {program} = decodeSearchParams(location.search)
  title = title.replace("<program>", program || "Search")
  return title
}
