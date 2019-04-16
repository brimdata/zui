/* @flow */
import type {Finding} from "../reducers/investigation"
import {isArray} from "../lib/is"

export const createFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_CREATE",
  finding
})

export const updateFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_UPDATE",
  finding
})

export const deleteFindingByTs = (ts: Date[] | Date) => ({
  type: "FINDING_DELETE",
  ts: isArray(ts) ? ts : [ts]
})

export const clearInvestigation = () => ({
  type: "INVESTIGATION_CLEAR"
})
