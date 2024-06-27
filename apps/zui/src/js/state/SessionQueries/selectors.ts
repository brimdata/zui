import {State} from "../types"
import {SessionQueriesState} from "./types"

export const raw = (state: State): SessionQueriesState => state.sessionQueries
export const find = (state: State, id: string) => state.sessionQueries[id]
