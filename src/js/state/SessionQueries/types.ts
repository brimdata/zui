import {Query} from "../Queries/types"

export type SessionQueriesState = {
  [queryId: string]: Query
}
