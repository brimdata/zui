import {createHandler} from "src/core/handlers"
import {firstPage} from "src/core/query/run"
import Current from "src/js/state/Current"

export const RESULTS_QUERY = "zui-results/main"
export const RESULTS_QUERY_COUNT = "zui-results/main-count"

export const runResultsMain = createHandler(({select, dispatch}) => {
  const query = select(Current.getQueryText)
  dispatch(firstPage({id: RESULTS_QUERY, query}))
})

export const runResultsCount = createHandler(({select, dispatch}) => {
  const query = select(Current.getQueryText) + "\n | count()"
  dispatch(firstPage({id: RESULTS_QUERY_COUNT, query}))
})
