import {
  FINDING_DELETE,
  INVESTIGATION_CLEAR,
  INVESTIGATION_PUSH,
  INVESTIGATION_CONNECTION_CLEAR
} from "./types"
import {SearchRecord} from "../../types"
import {isArray} from "../../lib/is"
import brim, {Ts} from "../../brim"

export default {
  push: (
    clusterId: string,
    spaceId: string,
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "INVESTIGATION_PUSH",
    clusterId,
    spaceId,
    entry: record,
    ts: ts
  }),

  deleteFindingByTs: (
    clusterId: string,
    spaceId: string,
    ts: Ts[] | Ts
  ): FINDING_DELETE => ({
    type: "FINDING_DELETE",
    clusterId,
    spaceId,
    ts: isArray(ts) ? ts : [ts]
  }),

  clearSpaceInvestigation: (
    clusterId: string,
    spaceId: string
  ): INVESTIGATION_CLEAR => ({
    type: "INVESTIGATION_CLEAR",
    clusterId,
    spaceId
  }),

  clearConnectionInvestigation: (
    connId: string
  ): INVESTIGATION_CONNECTION_CLEAR => ({
    type: "INVESTIGATION_CONNECTION_CLEAR",
    connId
  })
}
