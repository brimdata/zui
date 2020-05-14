/* @flow */

import type {IngestHandler} from "./types"
import type {State} from "../types"

export default {
  getIngestSpaceIds: (state: State): string[] => {
    return getIngestHandlers(state).map((i) => i.spaceId)
  }
}

function getIngestHandlers(state: State): IngestHandler[] {
  // $FlowFixMe
  return Object.values(state.handlers).filter((h) => h.type === "INGEST")
}
