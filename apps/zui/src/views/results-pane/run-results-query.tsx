import {createHandler} from "src/core/handlers"
import {firstPage} from "src/core/query/run"
import Current from "src/js/state/Current"
import QueryInfo from "src/js/state/QueryInfo"
import Results from "src/js/state/Results"

export const RESULTS_QUERY = "zui-results/main"
export const RESULTS_QUERY_COUNT = "zui-results/main-count"

export const runResultsMain = createHandler(
  async ({select, dispatch, waitForSelector}) => {
    const query = select(Current.getQueryText)
    const tabId = select(Current.getTabId)
    dispatch(firstPage({id: RESULTS_QUERY, query}))

    // See if we can paginate this query
    await waitForSelector(QueryInfo.getIsParsed).toReturn(true)
    const canPaginate = !select(QueryInfo.getIsSummarized)
    dispatch(Results.setCanPaginate({id: RESULTS_QUERY, canPaginate, tabId}))
  }
)

export const runResultsCount = createHandler(({select, dispatch}) => {
  const query = select(Current.getQueryText) + "\n | count()"
  dispatch(firstPage({id: RESULTS_QUERY_COUNT, query}))
})
