import Current from "src/js/state/Current"
import DraftQueries from "src/js/state/DraftQueries"
import Editor from "src/js/state/Editor"
import {syncPool} from "../core/pools/sync-pool"
import Results from "src/js/state/Results"
import {DRAFT_QUERY_NAME} from "./utils/brim-query"
import {startTransition} from "react"
import {getQuerySource} from "src/js/state/Queries/flows/get-query-source"

export function loadRoute(location) {
  return (dispatch) => {
    dispatch(syncEditor)
    dispatch(fetchData(location))
  }
}

function syncEditor(dispatch, getState) {
  const {queryId} = Current.getQueryLocationData(getState())
  const lakeId = Current.getLakeId(getState())
  const query = Current.getQuery(getState())
  const isDraft = dispatch(getQuerySource(queryId)) === "draft"
  const pool = Current.getQueryPool(getState())
  if (pool && !pool.hasSpan()) dispatch(syncPool(pool.id, lakeId))
  if (!query && queryId && isDraft) {
    // reset drafts?
    dispatch(
      DraftQueries.set({
        id: queryId,
        name: DRAFT_QUERY_NAME,
        value: "",
        pins: {},
      })
    )
  }
  // Give codemirror a chance to update by scheduling this update
  setTimeout(() => {
    dispatch(Editor.setValue(query?.value ?? ""))
    dispatch(Editor.setPins(query?.pins || []))
  })
}

function fetchData(location) {
  return (dispatch, getState) => {
    const key = Results.getKey(getState())
    const query = Current.getQuery(getState())

    if (key === location.key) return

    startTransition(() => {
      query && dispatch(Results.fetchFirstPage(query.toString()))
    })
  }
}
