import {createHandler} from "src/core/handlers"
import {firstPage} from "src/core/query/run"
import {QueryModel} from "src/js/models/query-model"
import Current from "src/js/state/Current"

export const RESULTS_QUERY = "zui-results/main"
export const RESULTS_QUERY_COUNT = "zui-results/main-count"

export const runResultsMain = createHandler(({select, dispatch}) => {
  const version = select(Current.getVersion)
  const query = QueryModel.versionToZed(version)

  dispatch(firstPage({id: RESULTS_QUERY, query}))
})

export const runResultsCount = createHandler(({select, dispatch}) => {
  const version = select(Current.getVersion)
  const query = QueryModel.versionToZed(version) + "\n | count()"

  dispatch(firstPage({id: RESULTS_QUERY_COUNT, query}))
})
