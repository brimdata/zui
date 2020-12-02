import {QueriesState} from "./types"
import {State} from "../types"

export default {
  getRaw: (state: State): QueriesState => state.queries
}
