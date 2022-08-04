import Queries from "src/js/state/Queries/index"
import RemoteQueries from "src/js/state/RemoteQueries"
import SessionQueries from "src/js/state/SessionQueries"

export type QuerySource = "local" | "remote" | "session"
export const getQuerySource =
  (id?: string) =>
  (_d, getState): QuerySource => {
    if (SessionQueries.getById(id)(getState())) return "session"
    if (Queries.getQueryById(id)(getState())) return "local"
    if (RemoteQueries.getQueryById(id)(getState())) return "remote"
    return null
  }
