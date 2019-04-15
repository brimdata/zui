/* @flow */
import type {Results} from "../types"
import type {SearchBar} from "./searchBar"
import type {Span} from "../BoomClient/types"
import type {State} from "./types"
import {last} from "../lib/Array"
import Log from "../models/Log"

export type Investigation = Finding[]
export type Finding = {
  ts: Date,
  searchBar: SearchBar,
  span: Span,
  space: string,
  note: ?string,
  logs: Log[],
  chart: {
    type: "Histogram",
    results: Results
  }
}

export default function(state: Investigation = [], a: *) {
  switch (a.type) {
    case "HISTOGRAM_SEARCH_RESULT":
      return updateLatest(state, {chart: {type: "Histogram", results: a.data}})
    case "FINDING_CREATE":
      return [...state, a.finding]
    case "FINDING_UPDATE":
      return updateLatest(state, a.finding)
    case "INVESTIGATION_CLEAR":
      return []
    default:
      return state
  }
}

function updateLatest(state, updates) {
  var finding = last(state)

  if (finding) {
    state[state.length - 1] = {...finding, ...updates}
    return [...state]
  } else {
    return state
  }
}

export function getInvestigation(state: State) {
  return state.investigation
}

export function getCurrentFinding(state: State) {
  return last(getInvestigation(state))
}
