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
      if (!draft[a.workspaceId]) draft[a.workspaceId] = {}
      if (!draft[a.workspaceId][a.spaceId]) draft[a.workspaceId][a.spaceId] = []

      draft[a.workspaceId][a.spaceId] = createFinding(
        draft[a.workspaceId][a.spaceId],
        a.entry,
        a.ts
      )
      return
    case "FINDING_DELETE":
      if (!draft[a.workspaceId] || !draft[a.workspaceId][a.spaceId]) return

      draft[a.workspaceId][a.spaceId] = draft[a.workspaceId][a.spaceId].filter(
        (f) => {
          for (const ts of a.ts) if (isEqual(ts, f.ts)) return false
          return true
        }
      )
      return
    case "INVESTIGATION_CLEAR":
      if (!draft[a.workspaceId] || !draft[a.workspaceId][a.spaceId]) return

      delete draft[a.workspaceId][a.spaceId]
      return
    case "INVESTIGATION_WORKSPACE_CLEAR":
      delete draft[a.workspaceId]
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
