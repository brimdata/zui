import {HandlersState, IngestHandler, Handler} from "./types"
import {State} from "../types"

export default {
  getIngestSpaceIds: (state: State): string[] => {
    return getIngestHandlers(state).map((i) => i.spaceId)
  },
  get: (state: State): HandlersState => state.handlers
}

function getIngestHandlers(state: State): IngestHandler[] {
  // @ts-ignore
  return Object.values(state.handlers).filter(
    (h: Handler) => h.type === "INGEST"
  )
}
