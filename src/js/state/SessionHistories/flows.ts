import {Thunk} from "../types"
import Current from "../Current"
import SessionHistories from "."
import getQueryById from "../Queries/flows/get-query-by-id"

export const push =
  (queryId: string, versionId?: string): Thunk =>
  (dispatch, getState) => {
    const sessionId = Current.getTabId(getState())
    const version =
      versionId || dispatch(getQueryById(queryId))?.latestVersionId() || ""
    const entry = {
      queryId,
      version,
    }
    dispatch(SessionHistories.pushById({sessionId, entry}))
  }

export const replace =
  (queryId: string, versionId?: string): Thunk =>
  (dispatch, getState) => {
    const sessionId = Current.getTabId(getState())
    const version =
      versionId || dispatch(getQueryById(queryId))?.latestVersionId() || ""
    const entry = {
      queryId,
      version,
    }
    dispatch(SessionHistories.replaceById({sessionId, entry}))
  }
