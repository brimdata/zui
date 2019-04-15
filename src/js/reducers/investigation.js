/* @flow */
import {isEqual} from "lodash"

import type {Results, SearchRecord} from "../types"
import type {State} from "./types"
import {last} from "../lib/Array"
import Log from "../models/Log"

export type Investigation = Finding[]
export type Finding = {
  ts: Date,
  record: SearchRecord,
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

function createFinding(state, record: SearchRecord, ts = new Date()) {
  if (sameRecord(last(state), {ts, record})) {
    return updateLatest(state, {ts})
  } else {
    return [...state, {ts, record}]
  }
}

function sameRecord(a: Finding, b: Finding) {
  return !!a && !!b && isEqual(a.record, b.record)
}

export function getInvestigation(state: State) {
  return state.investigation
}

export function getCurrentFinding(state: State) {
  return last(getInvestigation(state))
}
