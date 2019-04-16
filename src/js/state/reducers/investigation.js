/* @flow */
import {isEqual} from "lodash"

import type {Results, SearchRecord} from "../../types"
import type {State} from "./types"
import {last} from "../../lib/Array"
import Log from "../../models/Log"

export type Investigation = Finding[]
export type Finding = {
  ts: Date,
  search: SearchRecord,
  note?: string,
  logs?: Log[],
  chart?: {
    type: "Histogram",
    results: Results
  }
}

export default function(state: Investigation = [], a: *) {
  switch (a.type) {
    case "HISTOGRAM_SEARCH_RESULT":
      return updateLatest(state, {chart: {type: "Histogram", results: a.data}})
    case "SEARCH_HISTORY_PUSH":
      return createFinding(state, a.entry)
    case "FINDING_CREATE":
      return [...state, a.finding]
    case "FINDING_UPDATE":
      return updateLatest(state, a.finding)
    case "FINDING_DELETE":
      // $FlowFixMe
      return state.filter((f): boolean => !a.ts.includes(f.ts))
    case "INVESTIGATION_CLEAR":
      return []
    default:
      return state
  }
}

function updateLatest(state: Investigation, updates: $Shape<Finding>) {
  var finding = last(state)

  if (finding) {
    state[state.length - 1] = {...finding, ...updates}
    return [...state]
  } else {
    return state
  }
}

function createFinding(state, search: SearchRecord, ts = new Date()) {
  if (sameRecord(last(state), {ts, search})) {
    return updateLatest(state, {ts})
  } else {
    return [...state, {ts, search}]
  }
}

function sameRecord(a: Finding, b: Finding) {
  return !!a && !!b && isEqual(a.search, b.search)
}

export function getInvestigation(state: State) {
  return state.investigation
}

export function getCurrentFinding(state: State) {
  return last(getInvestigation(state))
}
