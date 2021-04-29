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
  | INVESTIGATION_WORKSPACE_CLEAR
  | INVESTIGATION_PUSH

export type Finding = {
  ts: Ts
  search: SearchRecord
}

export type FINDING_DELETE = {
  type: "$FINDING_DELETE"
  workspaceId: string
  poolId: string
  ts: Ts[]
}
export type INVESTIGATION_CLEAR = {
  type: "$INVESTIGATION_CLEAR"
  workspaceId: string
  poolId: string
}

export type INVESTIGATION_WORKSPACE_CLEAR = {
  type: "$INVESTIGATION_WORKSPACE_CLEAR"
  workspaceId: string
}

export type INVESTIGATION_PUSH = {
  type: "$INVESTIGATION_PUSH"
  workspaceId: string
  poolId: string
  entry: SearchRecord
  ts: Ts
}
