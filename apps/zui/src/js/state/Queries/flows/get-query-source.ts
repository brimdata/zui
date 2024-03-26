import Queries from "src/js/state/Queries/index"
import SessionQueries from "src/js/state/SessionQueries"
import {Thunk} from "../../types"

export type QuerySource = "local" | "session"
export const getQuerySource =
  (id?: string): Thunk<QuerySource | null> =>
  (_d, getState): QuerySource => {
    if (SessionQueries.find(getState(), id)) return "session"
    if (Queries.find(getState(), id)) return "local"
    return null
  }
