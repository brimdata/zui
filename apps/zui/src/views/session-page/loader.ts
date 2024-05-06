import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {startTransition} from "react"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import Pools from "src/js/state/Pools"
import {invoke} from "src/core/invoke"
import {runHistogramQuery} from "src/views/histogram-pane/run-query"
import {
  runResultsCount,
  runResultsMain,
} from "src/views/results-pane/run-results-query"
import Layout from "src/js/state/Layout"
import {syncPool} from "src/app/core/pools/sync-pool"
import {fetchQueryInfo} from "src/domain/session/handlers"
import QueryInfo from "src/js/state/QueryInfo"
import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"

export const loadRoute = createHandler(
  async ({select, dispatch}, locationKey: string) => {
    const history = select(Current.getHistory)
    const lakeId = select(Current.getLakeId)
    const version = select(Current.getVersion)
    const program = select(Current.getQueryText)
    const histogramVisible = select(Layout.getShowHistogram)

    dispatch(QueryInfo.reset())
    dispatch(Tabs.loaded(locationKey))
    dispatch(Notice.dismiss())

    setTimeout(() => {
      dispatch(Editor.setValue(version?.value ?? ""))
      dispatch(Editor.setPins(version?.pins || []))
    })

    startTransition(() => {
      if (version) {
        runResultsMain()
        runResultsCount()
        if (histogramVisible) runHistogramQuery()
      }
    })

    // We parse the query text on the server. In order to minimize
    // latency, we run the query first, then get the query info.
    // If you need to wait for the query info, use the waitForSelector
    // function and look for QueryInfo.getIsParsed to be true.
    const {session} = Active

    fetchQueryInfo(program).then((info) => {
      const {poolName, error} = info
      const pool = select(Pools.getByName(lakeId, poolName))

      dispatch(QueryInfo.set({isParsed: true, ...info}))
      invoke("updatePluginSessionOp", {poolName, program})
      if (pool && !pool.hasSpan()) {
        dispatch(syncPool(pool.id, lakeId))
      }

      if (!error && history.action === "PUSH") {
        session.pushHistory()
      }
    })
  }
)
