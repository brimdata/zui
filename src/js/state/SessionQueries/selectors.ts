import {SessionQueriesState} from "./types"
import {Query} from "../Queries/types"

export const raw = (s): SessionQueriesState => s.sessionQueries
export const getById =
  (sessionId: string) =>
  (s): Query =>
    s.sessionQueries[sessionId]
