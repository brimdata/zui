/* @flow */
import type {SearchBar} from "./searchBar"
import type {Span} from "../BoomClient/types"
import type {State} from "./types"
import {last} from "../lib/Array"
import Log from "../models/Log"

export type Investigation = Probe[]
export type Probe = {
  ts: Date,
  searchBar: SearchBar,
  span: Span,
  space: string,
  note: ?string,
  logs: Log[]
}

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
    case "INVESTIGATION_CLEAR":
      return []
    default:
      return state
  }
}

export function getInvestigation(state: State) {
  return state.investigation
}

export function getCurrentProbe(state: State) {
  return last(getInvestigation(state))
}
