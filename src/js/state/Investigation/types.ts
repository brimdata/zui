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
  clusterId: string
  spaceId: string
  ts: Ts[]
}
export type INVESTIGATION_CLEAR = {
  type: "INVESTIGATION_CLEAR"
  clusterId: string
  spaceId: string
}

export type INVESTIGATION_CONNECTION_CLEAR = {
  type: "INVESTIGATION_CONNECTION_CLEAR"
  connId: string
}

export type INVESTIGATION_PUSH = {
  type: "INVESTIGATION_PUSH"
  clusterId: string
  spaceId: string
  entry: SearchRecord
  ts: Ts
}
