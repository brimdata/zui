import {isEqual} from "lodash"

import {Finding, InvestigationAction, InvestigationState} from "./types"
import {SearchRecord} from "../../types"
import {Ts} from "../../brim"
import {last} from "../../lib/Array"
import produce from "immer"

const init = (): InvestigationState => ({})

export default produce((draft, a: InvestigationAction) => {
  switch (a.type) {
    case "$INVESTIGATION_PUSH":
      if (!draft[a.lakeId]) draft[a.lakeId] = {}
      if (!draft[a.lakeId][a.poolId]) draft[a.lakeId][a.poolId] = []

      draft[a.lakeId][a.poolId] = createFinding(
        draft[a.lakeId][a.poolId],
        a.entry,
        a.ts
      )
      return
    case "$FINDING_DELETE":
      if (!draft[a.lakeId] || !draft[a.lakeId][a.poolId]) return

      draft[a.lakeId][a.poolId] = draft[a.lakeId][a.poolId].filter((f) => {
        for (const ts of a.ts) if (isEqual(ts, f.ts)) return false
        return true
      })
      return
    case "$INVESTIGATION_CLEAR":
      if (!draft[a.lakeId] || !draft[a.lakeId][a.poolId]) return

      delete draft[a.lakeId][a.poolId]
      return
    case "$INVESTIGATION_LAKE_CLEAR":
      delete draft[a.lakeId]
      return
  }
}, init())

function createFinding(state, search: SearchRecord, ts: Ts) {
  if (sameRecord(last(state), {ts, search})) {
    return state
  }

  return [...state, {ts, search}]
}

function sameRecord(a: Finding, b: Finding) {
  return !!a && !!b && isEqual(a.search, b.search)
}
