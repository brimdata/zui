import {
  FINDING_DELETE,
  INVESTIGATION_CLEAR,
  INVESTIGATION_PUSH,
  INVESTIGATION_WORKSPACE_CLEAR
} from "./types"
import {SearchRecord} from "../../types"
import {isArray} from "../../lib/is"
import brim, {Ts} from "../../brim"

export default {
  push: (
    workspaceId: string,
    poolId: string,
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "$INVESTIGATION_PUSH",
    workspaceId,
    poolId,
    entry: record,
    ts: ts
  }),

  deleteFindingByTs: (
    workspaceId: string,
    poolId: string,
    ts: Ts[] | Ts
  ): FINDING_DELETE => ({
    type: "$FINDING_DELETE",
    workspaceId,
    poolId,
    ts: isArray(ts) ? ts : [ts]
  }),

  clearPoolInvestigation: (
    workspaceId: string,
    poolId: string
  ): INVESTIGATION_CLEAR => ({
    type: "$INVESTIGATION_CLEAR",
    workspaceId,
    poolId
  }),

  clearWorkspaceInvestigation: (
    workspaceId: string
  ): INVESTIGATION_WORKSPACE_CLEAR => ({
    type: "$INVESTIGATION_WORKSPACE_CLEAR",
    workspaceId
  })
}
