import produce from "immer"

import {Space, SpacesAction, SpacesState} from "./types"
import brim from "../../brim"

const init: SpacesState = {}

const spacesReducer = produce((draft, action: SpacesAction) => {
  switch (action.type) {
    case "SPACES_SET":
      return action.spaces.reduce((next, space) => {
        next[space.id] = defaults(space, draft[space.id])
        return next
      }, {})

    case "SPACES_DETAIL":
      var {id} = action.space // XXX adapter hack to support span payloads from zqd as well as min/max
      // time. In the future brim.Span type should mimic the formatted
      // transmitted over the wire.

      var space = brim.interop.spacePayloadToSpace(action.space)
      draft[id] = defaults(space, draft[id])
      break

    case "SPACES_RENAME":
      getSpace(draft, action.spaceId).name = action.newName
      break

    case "SPACES_INGEST_PROGRESS":
      getSpace(draft, action.spaceId).ingest.progress = action.value
      break

    case "SPACES_INGEST_WARNING_APPEND":
      getSpace(draft, action.spaceId).ingest.warnings.push(action.warning)
      break

    case "SPACES_INGEST_WARNING_CLEAR":
      getSpace(draft, action.spaceId).ingest.warnings = []
      break

    case "SPACES_INGEST_SNAPSHOT":
      getSpace(draft, action.spaceId).ingest.snapshot = action.count
      break

    case "SPACES_REMOVE":
      delete draft[action.spaceId]
      break
  }
})

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  if (action.type === "SPACES_CONNECTION_REMOVE") {
    delete state[action.connId]
    return state
  } else if (action.type.startsWith("SPACES_")) {
    return {
      ...state,
      [action.clusterId]: spacesReducer(state[action.clusterId] || {}, action)
    }
  } else {
    return state
  }
}

function defaults(next: Space, prev: Space): Space {
  // It would be nice to not need to keep this ingest state in the space
  // object. An separate ingest reducer would be good.
  const space = brim.interop.spacePayloadToSpace(next)
  const defaults = {min_time: {sec: 0, ns: 0}, max_time: {sec: 0, ns: 0}}
  const defaultIngest = {progress: null, warnings: [], snapshot: null}
  const prevIngest = prev && prev.ingest
  return {
    ...defaults,
    ...space,
    ingest: {
      ...defaultIngest,
      ...prevIngest,
      ...space.ingest
    }
  }
}

function getSpace(state, id) {
  if (state[id]) return state[id]
  else throw new Error("No space exists with id: " + id)
}
