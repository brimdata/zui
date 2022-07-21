import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {syncPool} from "../core/pools/sync-pool"
import Results from "src/js/state/Results"
import {startTransition} from "react"
import QueryVersions from "src/js/state/QueryVersions"
import {BrimQuery} from "./utils/brim-query"

export function loadRoute(location) {
  return (dispatch) => {
    dispatch(syncEditor)
    dispatch(fetchData(location))
  }
}

function syncEditor(dispatch, getState) {
  const lakeId = Current.getLakeId(getState())
  const query = Current.getQuery(getState())

  // TODO: Session Flow - this works but should find way to refactor
  // query may be pointing to a session version which exists on the session query
  const tabId = Current.getTabId(getState())
  const currentVersionId = query.currentVersionId
  const isSession = currentVersionId && !query?.hasVersion(currentVersionId)
  const version = isSession
    ? QueryVersions.getByVersion(tabId, currentVersionId)(getState())
    : query?.current

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
    const key = Results.getKey(getState())
    const query = Current.getQuery(getState())

    // TODO: Session Flow - this works but should find way to refactor
    // query may be pointing to a session version which exists on the session query
    const tabId = Current.getTabId(getState())
    const currentVersionId = query.currentVersionId
    const isSession = currentVersionId && !query?.hasVersion(currentVersionId)
    const version = isSession
      ? QueryVersions.getByVersion(tabId, currentVersionId)(getState())
      : query?.current

    if (key === location.key) return

    startTransition(() => {
      version &&
        dispatch(Results.fetchFirstPage(BrimQuery.versionToZed(version)))
    })
  }
}
