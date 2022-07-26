import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {syncPool} from "../core/pools/sync-pool"
import Results from "src/js/state/Results"
import {startTransition} from "react"
import {BrimQuery} from "./utils/brim-query"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import Notice from "src/js/state/Notice"

export function loadRoute(location) {
  return (dispatch) => {
    dispatch(Notice.dismiss())
    dispatch(Results.error({id: MAIN_RESULTS, error: null, tabId: ""}))
    dispatch(syncEditor)
    dispatch(fetchData(location))
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

function fetchData(location) {
  return (dispatch, getState) => {
    const key = Results.getKey(MAIN_RESULTS)(getState())
    const version = Current.getVersion(getState())

    if (key === location.key) return

    startTransition(() => {
      version &&
        dispatch(Results.fetchFirstPage(BrimQuery.versionToZed(version)))
    })
  }
}
