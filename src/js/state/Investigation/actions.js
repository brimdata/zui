/* @flow */

import type {
  FINDING_CREATE,
  FINDING_DELETE,
  FINDING_UPDATE,
  Finding,
  INVESTIGATION_CLEAR,
  INVESTIGATION_PUSH
} from "./types"
import type {SearchRecord} from "../../types"
import {isArray} from "../../lib/is"
import brim, {type Ts} from "../../brim"

export default {
  push: (
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "INVESTIGATION_PUSH",
    entry: record,
    ts: ts
  }),
  createFinding: (finding: $Shape<Finding>): FINDING_CREATE => ({
    type: "FINDING_CREATE",
    finding
  }),

  updateFinding: (finding: $Shape<Finding>): FINDING_UPDATE => ({
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
