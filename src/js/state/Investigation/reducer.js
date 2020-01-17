/* @flow */

import {isEqual} from "lodash"

import type {Finding, InvestigationAction, InvestigationState} from "./types"
import type {SearchRecord} from "../../types"
import {last} from "../../lib/Array"
import brim, {type Ts} from "../../brim"

const init: InvestigationState = []

export default function reducer(
  state: InvestigationState = init,
  a: InvestigationAction
): InvestigationState {
  switch (a.type) {
    case "HISTORY_PUSH":
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

function updateLatest(state: InvestigationState, updates: $Shape<Finding>) {
  var finding = last(state)
  if (finding) {
    state[state.length - 1] = {...finding, ...updates}
    return [...state]
  } else {
    return state
  }
}

function createFinding(
  state,
  search: SearchRecord,
  ts: Ts = brim.time().toTs()
) {
  if (sameRecord(last(state), {ts, search})) {
    return state
  } else {
    return [...state, {ts, search}]
  }
}

function sameRecord(a: Finding, b: Finding) {
  return !!a && !!b && isEqual(a.search, b.search)
}
