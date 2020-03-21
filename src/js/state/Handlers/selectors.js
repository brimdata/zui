/* @flow */

import type {IngestHandler} from "./types"
import type {State} from "../types"

export default {
  getIngests: (state: State): IngestHandler[] => {
    // $FlowFixMe
    return Object.values(state.handlers).filter((h) => h.type === "INGEST")
  }
}
