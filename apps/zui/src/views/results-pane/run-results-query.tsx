import {createHandler} from "src/core/handlers"
import {firstPage} from "src/core/query/run"
import Current from "src/js/state/Current"
import QueryInfo from "src/js/state/QueryInfo"
import Results from "src/js/state/Results"
import {Active} from "src/models/active"
import {RESULTS_QUERY, RESULTS_QUERY_COUNT} from "./config"

export const runResultsMain = createHandler(
  async ({select, dispatch, waitForSelector}) => {
    const query = Active.snapshot.queryText
    const tabId = select(Current.getTabId)
    dispatch(firstPage({id: RESULTS_QUERY, query}))

    // See if we can paginate this query
    let canPaginate = false
    if (Active.lake.features.describe) {
      await waitForSelector(QueryInfo.getIsParsed).toReturn(true)
      canPaginate = !select(QueryInfo.hasAggregation)
    }
    dispatch(Results.setCanPaginate({id: RESULTS_QUERY, canPaginate, tabId}))
  }
)

export const runResultsCount = createHandler(({select, dispatch}) => {
  const query = select(Current.getQueryText) + "\n | count()"
  dispatch(firstPage({id: RESULTS_QUERY_COUNT, query}))
})
