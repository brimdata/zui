import {isEqual} from "lodash"

import {Finding, InvestigationAction, InvestigationState} from "./types"
import {SearchRecord} from "../../types"
import {Ts} from "../../brim"
import {last} from "../../lib/Array"
import produce from "immer"

const init = (): InvestigationState => ({})

export default produce((draft, a: InvestigationAction) => {
  switch (a.type) {
    case "INVESTIGATION_PUSH":
      if (!draft[a.clusterId]) draft[a.clusterId] = {}
      if (!draft[a.clusterId][a.spaceId]) draft[a.clusterId][a.spaceId] = []

      draft[a.clusterId][a.spaceId] = createFinding(
        draft[a.clusterId][a.spaceId],
        a.entry,
        a.ts
      )
      return
    case "FINDING_DELETE":
      if (!draft[a.clusterId] || !draft[a.clusterId][a.spaceId]) return

      draft[a.clusterId][a.spaceId] = draft[a.clusterId][a.spaceId].filter(
        (f) => {
          for (const ts of a.ts) if (isEqual(ts, f.ts)) return false
          return true
        }
      )
      return
    case "INVESTIGATION_CLEAR":
      if (!draft[a.clusterId] || !draft[a.clusterId][a.spaceId]) return

      delete draft[a.clusterId][a.spaceId]
      return
    case "INVESTIGATION_CONNECTION_CLEAR":
      delete draft[a.connId]
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
