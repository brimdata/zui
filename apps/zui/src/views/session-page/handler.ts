import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {NamedQuery} from "src/models/named-query"
import {Props, State} from "."
import {StateObject} from "src/core/state-object"
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
import {syncPool} from "src/app/core/pools/sync-pool"

export class SessionPageHandler extends ViewHandler {
  constructor(public props: Props, public state: StateObject<State>) {
    super()
  }

  load() {
    this.reset()
    this.setEditorValues()
    this.setNamedQuery()
    this.fetchResults()
    this.parseQueryText()
  }

  private async setNamedQuery() {
    if (Active.session.hasNamedQuery) {
      const namedQuery = await NamedQuery.read(Active.session.parentId)
      const isModified = !Active.session.snapshot.equals(namedQuery.snapshot)
      this.state.set({namedQuery, isModified})
    } else {
      this.state.set({namedQuery: null, isModified: false})
    }
  }

  private reset() {
    this.dispatch(QueryInfo.reset())
    this.dispatch(Tabs.loaded(this.props.locationKey))
    this.dispatch(Notice.dismiss()) // This may not be needed any more
  }

  private setEditorValues() {
    const snapshot = Active.session.snapshot
    // Give editor a chance to update by scheduling this update
    setTimeout(() => {
      this.dispatch(Editor.setValue(snapshot.attrs.value ?? ""))
      this.dispatch(Editor.setPins(snapshot.attrs.pins || []))
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
    const {session} = Active
    const lakeId = this.select(Current.getLakeId)
    const program = this.select(Current.getQueryText)
    const history = this.select(Current.getHistory)

    fetchQueryInfo(program).then((info) => {
      const {poolName, error} = info
      const pool = this.select(Pools.getByName(lakeId, poolName))

      this.dispatch(QueryInfo.set({isParsed: true, ...info}))
      this.invoke("updatePluginSessionOp", {poolName, program})
      if (pool && !pool.hasSpan()) {
        this.dispatch(syncPool(pool.id, lakeId))
      }

      if (!error && history.action === "PUSH") {
        session.pushHistory()
      }
    })
  }
}
