import {SearchRecord} from "../../types"
import {Ts} from "../../brim"

export type InvestigationState = {
  [key: string]: {
    [key: string]: Finding[]
  }
}
export type InvestigationAction =
  | FINDING_DELETE
  | INVESTIGATION_CLEAR
  | INVESTIGATION_LAKE_CLEAR
  | INVESTIGATION_PUSH

export type Finding = {
  ts: Ts
  search: SearchRecord
}

export type FINDING_DELETE = {
  type: "$FINDING_DELETE"
  lakeId: string
  poolId: string
  ts: Ts[]
}
export type INVESTIGATION_CLEAR = {
  type: "$INVESTIGATION_CLEAR"
  lakeId: string
  poolId: string
}

export type INVESTIGATION_LAKE_CLEAR = {
  type: "$INVESTIGATION_LAKE_CLEAR"
  lakeId: string
}

export type INVESTIGATION_PUSH = {
  type: "$INVESTIGATION_PUSH"
  lakeId: string
  poolId: string
  entry: SearchRecord
  ts: Ts
}
