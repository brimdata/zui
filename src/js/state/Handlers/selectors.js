/* @flow */

import type {IngestHandler} from "./types"
import type {State} from "../types"

export default {
  getIngestSpaceNames: (state: State): string[] => {
    return getIngestHandlers(state).map((i) => i.spaceName)
  }
}

function getIngestHandlers(state: State): IngestHandler[] {
  // $FlowFixMe
  return Object.values(state.handlers).filter((h) => h.type === "INGEST")
}
