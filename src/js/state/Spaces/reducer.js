/* @flow */

import produce from "immer"

import brim, {type Ts} from "../../brim"
import type {SpacesAction, SpacesState} from "./types"
import {isNumber} from "../../lib/is"

const init: SpacesState = {}

const spacesReducer = produce((draft, action: SpacesAction) => {
  switch (action.type) {
    case "SPACES_NAMES":
      return action.names.reduce((next, name) => {
        next[name] = draft[name]
        return next
      }, {})

    case "SPACES_DETAIL":
      var {name} = action.space
      var space = (action.space: any)
      // XXX adapter hack to support span payloads from zqd as well as min/max
      // time. In the future brim.Span type should mimic the formatted
      // transmitted over the wire.
      if (space.span) {
        let span = action.space.span
        let end = brim
          .time(span.ts)
          .addDur((span.dur: Ts))
          .toTs()
        space = {...space, min_time: span.ts, max_time: end}
        delete space.span
      }
      draft[name] = {...draft[name], ...space}
      break

    case "SPACES_INGEST_PROGRESS":
      getSpace(draft, action.space).ingest_progress = action.value
      break

    case "SPACES_INGEST_WARNING_APPEND":
      getSpace(draft, action.space).ingest_warnings.push(action.warning)
      break

    case "SPACES_INGEST_WARNING_CLEAR":
      draft[action.space].ingest_warnings = []
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

function getSpace(state, name) {
  let space = state[name] ? state[name] : {}
  if (!space.ingest_warnings) space.ingest_warnings = []
  if (!isNumber(space.ingest_progress)) space.ingest_progress = null
  state[name] = space
  return state[name]
}
