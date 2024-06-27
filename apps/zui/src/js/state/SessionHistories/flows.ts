import {Thunk} from "../types"
import Current from "../Current"
import SessionHistories from "."
import Queries from "../Queries"

export const push =
  (queryId: string, versionId?: string): Thunk =>
  (dispatch, getState) => {
    const sessionId = Current.getTabId(getState())
    const savedQuery = Queries.build(getState(), queryId)
    const version = versionId || savedQuery?.latestVersionId() || ""
    const entry = {queryId, version}
    dispatch(SessionHistories.pushById({sessionId, entry}))
  }

export const replace =
  (queryId: string, versionId?: string): Thunk =>
  (dispatch, getState) => {
    const sessionId = Current.getTabId(getState())
    const savedQuery = Queries.build(getState(), queryId)
    const version = versionId || savedQuery?.latestVersionId() || ""
    const entry = {queryId, version}
    dispatch(SessionHistories.replaceById({sessionId, entry}))
  }
