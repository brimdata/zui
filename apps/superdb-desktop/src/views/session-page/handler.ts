import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import QueryInfo from "src/js/state/QueryInfo"
import Tabs from "src/js/state/Tabs"
import Notice from "src/js/state/Notice"
import Editor from "src/js/state/Editor"
import {startTransition} from "react"
import {
  runResultsCount,
  runResultsMain,
} from "../results-pane/run-results-query"
import Layout from "src/js/state/Layout"
import {runHistogramQuery} from "../histogram-pane/run-query"
import {fetchQueryInfo} from "src/domain/session/handlers"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {syncPool} from "src/models/sync-pool"
import Table from "src/js/state/Table"
import Inspector from "src/js/state/Inspector"
import Selection from "src/js/state/Selection"

type Props = {
  locationKey: string
}

export class SessionPageHandler extends ViewHandler {
  constructor(public props: Props) {
    super()
  }

  load() {
    this.reset()
    this.setEditorValues()
    this.fetchResults()
    this.parseQueryText()
  }

  private reset() {
    this.dispatch(Selection.reset())
    this.dispatch(Table.setScrollPosition({top: 0, left: 0}))
    this.dispatch(Inspector.setScrollPosition({top: 0, left: 0}))
    this.dispatch(QueryInfo.reset())
    this.dispatch(Tabs.loaded(this.props.locationKey))
    this.dispatch(Notice.dismiss()) // This may not be needed any more
  }

  private setEditorValues() {
    const snapshot = Active.snapshot
    // Give editor a chance to update by scheduling this update
    setTimeout(() => {
      this.dispatch(Editor.setValue(snapshot.value ?? ""))
      this.dispatch(Editor.setPins(snapshot.pins || []))
    })
  }

  private fetchResults() {
    startTransition(() => {
      runResultsMain()
      runResultsCount()
      if (this.histogramVisible) runHistogramQuery()
    })
  }

  private get histogramVisible() {
    return this.select(Layout.getShowHistogram)
  }

  private async parseQueryText() {
    const lakeId = this.select(Current.getLakeId)
    const program = this.select(Current.getQueryText)

    if (!Active.lake.features.describe) {
      this.dispatch(QueryInfo.merge({isParsed: true}))
      this.invoke("updatePluginSessionOp", {poolName: null, program})
      return
    }

    fetchQueryInfo(program).then((info) => {
      this.dispatch(QueryInfo.set({isParsed: true, ...info}))
      const poolName = this.select(QueryInfo.getPoolName)
      this.invoke("updatePluginSessionOp", {poolName, program})
      const pool = this.select(Pools.getByName(lakeId, poolName))

      if (pool && !pool.hasSpan()) {
        this.dispatch(syncPool(pool.id, lakeId))
      }

      if (info.error) {
        // Maybe update the snapshot to indicate there is an error
      }
    })
  }
}
