/* @flow */
import type {Action, State} from "./types"

export type Investigation = Probe[]
export type Probe = {}

export default function(state: Investigation = [], a: *) {
  switch (a.type) {
    case "PROBE_NEW":
      return [...state, a.probe]
    case "PROBE_ADD_TO":
      var tmp = state[state.length - 1]
      if (tmp) {
        state[state.length - 1] = {...tmp, ...a.probe}
      }
      return [...state]
    default:
      return state
  }
}

export function getInvestigation(state: State) {
  return state.investigation
}
