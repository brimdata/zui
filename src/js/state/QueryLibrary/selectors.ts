import {QueryLibraryState} from "./types"
import {State} from "../types"

export default {
  getRaw: (state: State): QueryLibraryState => state.queryLibrary
}
