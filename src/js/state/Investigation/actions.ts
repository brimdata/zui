import {
  FINDING_DELETE,
  FINDING_UPDATE,
  Finding,
  INVESTIGATION_CLEAR,
  INVESTIGATION_PUSH
} from "./types"
import {SearchRecord} from "../../types"
import {isArray} from "../../lib/is"
import brim, {Ts} from "../../brim"

export default {
  push: (
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "INVESTIGATION_PUSH",
    entry: record,
    ts: ts
  }),
  updateFinding: (finding: Partial<Finding>): FINDING_UPDATE => ({
    type: "FINDING_UPDATE",
    finding
  }),

  deleteFindingByTs: (ts: Ts[] | Ts): FINDING_DELETE => ({
    type: "FINDING_DELETE",
    ts: isArray(ts) ? ts : [ts]
  }),

  clearInvestigation: (): INVESTIGATION_CLEAR => ({
    type: "INVESTIGATION_CLEAR"
  })
}
