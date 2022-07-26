import Queries from "src/js/state/Queries"
import {flattenQueryTree} from "src/js/state/Queries/helpers"

const getQueryListMenu =
  () =>
  (dispatch, getState, {api}) => {
    const state = getState()
    const queries = Queries.raw(state)

    return flattenQueryTree(queries, false)
      ?.map((q) => q.model)
      .map((q) => ({
        label: q.name,
        click: () => api.queries.open(q.id),
      }))
  }

export default getQueryListMenu
