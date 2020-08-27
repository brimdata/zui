/* @flow */

import type {HandlersState, IngestHandler} from "./types"
import type {State} from "../types"

export default {
  getIngestSpaceIds: (state: State): string[] => {
    return getIngestHandlers(state).map((i) => i.spaceId)
  },
  get: (state: State): HandlersState => state.handlers
}

function getIngestHandlers(state: State): IngestHandler[] {
  // $FlowFixMe
  return Object.values(state.handlers).filter((h) => h.type === "INGEST")
}
