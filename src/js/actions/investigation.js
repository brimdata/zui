/* @flow */
import type {Finding} from "../reducers/investigation"

export const createFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_CREATE",
  finding
})

export const updateFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_UPDATE",
  finding
})

export const deleteFindingByTs = (...ts: Date[]) => ({
  type: "FINDING_DELETE",
  ts
})

export const clearInvestigation = () => ({
  type: "INVESTIGATION_CLEAR"
})
