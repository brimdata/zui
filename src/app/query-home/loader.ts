import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {syncPool} from "../core/pools/sync-pool"
import Results from "src/js/state/Results"
import {startTransition} from "react"
import {BrimQuery} from "./utils/brim-query"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {Location} from "history"
import {runHistogramQuery} from "src/js/state/Histogram/run-query"

export function loadRoute(location: Location): Thunk {
  return (dispatch) => {
    dispatch(Tabs.loaded(location.key))
    dispatch(Notice.dismiss())
    dispatch(Results.error({id: MAIN_RESULTS, error: null, tabId: ""}))
    dispatch(syncEditor)
    dispatch(fetchData())
  }
}

function syncEditor(dispatch, getState) {
  const lakeId = Current.getLakeId(getState())
  const version = Current.getVersion(getState())

  const pool = Current.getQueryPool(getState())
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
        dispatch(Results.fetchFirstPage(BrimQuery.versionToZed(version)))
        dispatch(runHistogramQuery())
      }
    })
  }
}
