import {firstPage} from "src/core/query/run"
import {QueryModel} from "src/js/models/query-model"
import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"

export const RESULTS_QUERY = "zui-results/main"

export function runResultsQuery(): Thunk {
  return (dispatch, getState) => {
    const version = Current.getVersion(getState())
    const query = QueryModel.versionToZed(version)
    dispatch(firstPage({id: RESULTS_QUERY, query}))
  }
}
