/* @flow */

import produce from "immer"

import brim from "../../brim"
import type {Space, SpacesAction, SpacesState} from "./types"

const init: SpacesState = {}

const spacesReducer = produce((draft, action: SpacesAction) => {
  switch (action.type) {
    case "SPACES_NAMES":
      return action.names.reduce((next, name) => {
        next[name] = defaults(name, draft[name])
        return next
      }, {})

    case "SPACES_DETAIL":
      var {name} = action.space
      // XXX adapter hack to support span payloads from zqd as well as min/max
      // time. In the future brim.Span type should mimic the formatted
      // transmitted over the wire.
      var space = brim.interop.spacePayloadToSpace(action.space)
      draft[name] = defaults(name, {...draft[name], ...space})
      break

    case "SPACES_INGEST_PROGRESS":
      getSpace(draft, action.name).ingest.progress = action.value
      break

    case "SPACES_INGEST_WARNING_APPEND":
      getSpace(draft, action.name).ingest.warnings.push(action.warning)
      break

    case "SPACES_INGEST_WARNING_CLEAR":
      getSpace(draft, action.name).ingest.warnings = []
      break

    case "SPACES_INGEST_SNAPSHOT":
      getSpace(draft, action.name).ingest.snapshot = action.count
      break

    case "SPACES_REMOVE":
      delete draft[action.name]
      break
  }
})

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  if (action.type.startsWith("SPACES_")) {
    return {
      ...state,
      [action.clusterId]: spacesReducer(state[action.clusterId] || {}, action)
    }
  } else {
    return state
  }
}

function defaults(name, data: $Shape<Space> = {}): Space {
  let defaults = {
    name,
    min_time: {ns: 0, sec: 0},
    max_time: {ns: 0, sec: 0},
    pcap_support: false,
    ingest: {
      progress: null,
      warnings: [],
      snapshot: null,
      ...data.ingest
    }
  }
  return {...defaults, ...data}
}

function getSpace(state, name) {
  if (state[name]) return state[name]
  else throw new Error("No space exists with name: " + name)
}
