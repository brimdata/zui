import {Ts} from "../../brim"

export type PoolsState = {
  // workspaceId
  [key: string]: {
    // poolId
    [key: string]: Pool
  }
}

export type PoolsAction =
  | POOLS_SET
  | POOLS_DETAIL
  | POOLS_RENAME
  | POOLS_INGEST_PROGRESS
  | POOLS_INGEST_WARNING_APPEND
  | POOLS_INGEST_WARNING_CLEAR
  | POOLS_REMOVE
  | POOLS_WORKSPACE_REMOVE
export type Pool = {
  name: string
  id: string
  min_time: Ts
  max_time: Ts
  ingest: PoolIngest
  size: number
}

type PoolIngest = {
  warnings: string[]
  progress: number | null
}

export type POOLS_SET = {
  type: "$POOLS_SET"
  workspaceId: string
  pools: Partial<Pool>[]
}

export type POOLS_DETAIL = {
  type: "$POOLS_DETAIL"
  workspaceId: string
  pool: Partial<Pool>
}

export type POOLS_RENAME = {
  type: "$POOLS_RENAME"
  workspaceId: string
  poolId: string
  newName: string
}

export type POOLS_INGEST_PROGRESS = {
  type: "$POOLS_INGEST_PROGRESS"
  workspaceId: string
  poolId: string
  value: number | null
}

export type POOLS_INGEST_WARNING_APPEND = {
  type: "$POOLS_INGEST_WARNING_APPEND"
  warning: string
  poolId: string
  workspaceId: string
}

export type POOLS_INGEST_WARNING_CLEAR = {
  type: "$POOLS_INGEST_WARNING_CLEAR"
  poolId: string
  workspaceId: string
}

export type POOLS_REMOVE = {
  type: "$POOLS_REMOVE"
  workspaceId: string
  poolId: string
}

export type POOLS_WORKSPACE_REMOVE = {
  type: "$POOLS_WORKSPACE_REMOVE"
  workspaceId: string
}
