/* @flow */

import type {
  FINDING_CREATE,
  FINDING_DELETE,
  FINDING_UPDATE,
  Finding,
  INVESTIGATION_CLEAR
} from "./types"
import type {Ts} from "../../brim"
import {isArray} from "../../lib/is"

export default {
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
