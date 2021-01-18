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
  | INVESTIGATION_CONNECTION_CLEAR
  | INVESTIGATION_PUSH

export type Finding = {
  ts: Ts
  search: SearchRecord
}

export type FINDING_DELETE = {
  type: "FINDING_DELETE"
  workspaceId: string
  spaceId: string
  ts: Ts[]
}
export type INVESTIGATION_CLEAR = {
  type: "INVESTIGATION_CLEAR"
  workspaceId: string
  spaceId: string
}

export type INVESTIGATION_CONNECTION_CLEAR = {
  type: "INVESTIGATION_CONNECTION_CLEAR"
  workspaceId: string
}

export type INVESTIGATION_PUSH = {
  type: "INVESTIGATION_PUSH"
  workspaceId: string
  spaceId: string
  entry: SearchRecord
  ts: Ts
}
