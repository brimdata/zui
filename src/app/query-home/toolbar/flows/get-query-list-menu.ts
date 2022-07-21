import Queries from "../../../../js/state/Queries"
import {lakeQueryPath} from "../../../router/utils/paths"
import Current from "src/js/state/Current"
import {flattenQueryTree} from "src/js/state/Queries/helpers"
import tabHistory from "../../../router/tab-history"
import SessionHistories from "../../../../js/state/SessionHistories"
import getQueryById from "../../../../js/state/Queries/flows/get-query-by-id"

const getQueryListMenu = () => (dispatch, getState) => {
  const state = getState()
  const queries = Queries.raw(state)
  const lakeId = Current.getLakeId(state)

  return flattenQueryTree(queries, false)
    ?.map((q) => q.model)
    .map((q) => ({
      label: q.name,
      click: () => {
        const latestVersionId = dispatch(getQueryById(q.id))?.latestVersionId()
        dispatch(tabHistory.push(lakeQueryPath(q.id, lakeId, latestVersionId)))
        dispatch(SessionHistories.push(q.id))
      },
    }))
}

export default getQueryListMenu
