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
    spaceId: string,
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "$INVESTIGATION_PUSH",
    workspaceId,
    spaceId,
    entry: record,
    ts: ts
  }),

  deleteFindingByTs: (
    workspaceId: string,
    spaceId: string,
    ts: Ts[] | Ts
  ): FINDING_DELETE => ({
    type: "$FINDING_DELETE",
    workspaceId,
    spaceId,
    ts: isArray(ts) ? ts : [ts]
  }),

  clearSpaceInvestigation: (
    workspaceId: string,
    spaceId: string
  ): INVESTIGATION_CLEAR => ({
    type: "$INVESTIGATION_CLEAR",
    workspaceId,
    spaceId
  }),

  clearWorkspaceInvestigation: (
    workspaceId: string
  ): INVESTIGATION_WORKSPACE_CLEAR => ({
    type: "$INVESTIGATION_WORKSPACE_CLEAR",
    workspaceId
  })
}
