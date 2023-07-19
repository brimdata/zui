export type LakeStatusesState = {
  [lakeId: string]: LakeStatus
}

export type LakeStatus =
  | null
  | "connected"
  | "disconnected"
  | "retrying"
  | "login-required"

export type LakeStatusesAction = LAKE_STATUSES_SET | LAKE_STATUSES_REMOVE

export type LAKE_STATUSES_SET = {
  type: "LAKE_STATUSES_SET"
  lakeId: string
  status: LakeStatus
}

export type LAKE_STATUSES_REMOVE = {
  type: "LAKE_STATUSES_REMOVE"
  lakeId: string
}
