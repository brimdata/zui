import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {syncPool} from "../core/pools/sync-pool"
import {startTransition} from "react"
import {QueryModel} from "../../js/models/query-model"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {Location} from "history"
import Pools from "src/js/state/Pools"
import {invoke} from "src/core/invoke"
import {runResultsQuery} from "src/panes/results-pane/run-results-query"
import {runHistogramQuery} from "src/panes/histogram-pane/run-histogram-query"

export function loadRoute(location: Location): Thunk {
  return (dispatch) => {
    dispatch(syncPluginContext)
    dispatch(Tabs.loaded(location.key))
    dispatch(Notice.dismiss())
    dispatch(syncEditor)
    dispatch(fetchData())
  }
}

function syncPluginContext(dispatch, getState) {
  const poolName = Current.getActiveQuery(getState()).toAst().poolName
  const program = QueryModel.versionToZed(Current.getVersion(getState()))
  invoke("updatePluginSessionOp", {poolName, program})
}

function syncEditor(dispatch, getState) {
  const lakeId = Current.getLakeId(getState())
  const version = Current.getVersion(getState())
  const poolName = Current.getActiveQuery(getState()).toAst().poolName
  const pool = Pools.getByName(lakeId, poolName)(getState())

  if (pool && !pool.hasSpan()) dispatch(syncPool(pool.id, lakeId))

  // Give codemirror a chance to update by scheduling this update
  setTimeout(() => {
    dispatch(Editor.setValue(version?.value ?? ""))
    dispatch(Editor.setPins(version?.pins || []))
  })
}

function fetchData() {
  return (dispatch, getState) => {
    const version = Current.getVersion(getState())

    startTransition(() => {
      if (version) {
        dispatch(runResultsQuery())
        dispatch(runHistogramQuery())
      }
    })
  }
}
