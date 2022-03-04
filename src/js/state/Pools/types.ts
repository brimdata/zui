import {PoolConfig, PoolStats} from "@brimdata/zealot/types"

export type PoolState = {
  data: PoolConfig
  stats: PoolStats
}

export type PoolsState = {
  // lakeId
  [key: string]: {
    // poolId
    [key: string]: PoolState
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
  | POOLS_LAKE_REMOVE
export type Pool = {
  name: string
  id: string
  ingest: PoolIngest
  size: number
  span: {
    ts: Date
    dur: number
  }
}

type PoolIngest = {
  warnings: string[]
  progress: number | null
}

export type POOLS_SET = {
  type: "$POOLS_SET"
  lakeId: string
  pools: Partial<Pool>[]
}

export type POOLS_DETAIL = {
  type: "$POOLS_DETAIL"
  lakeId: string
  pool: Partial<Pool>
}

export type POOLS_RENAME = {
  type: "$POOLS_RENAME"
  lakeId: string
  poolId: string
  newName: string
}

export type POOLS_INGEST_PROGRESS = {
  type: "$POOLS_INGEST_PROGRESS"
  lakeId: string
  poolId: string
  value: number | null
}

export type POOLS_INGEST_WARNING_APPEND = {
  type: "$POOLS_INGEST_WARNING_APPEND"
  warning: string
  poolId: string
  lakeId: string
}

export type POOLS_INGEST_WARNING_CLEAR = {
  type: "$POOLS_INGEST_WARNING_CLEAR"
  poolId: string
  lakeId: string
}

export type POOLS_REMOVE = {
  type: "$POOLS_REMOVE"
  lakeId: string
  poolId: string
}

export type POOLS_LAKE_REMOVE = {
  type: "$POOLS_LAKE_REMOVE"
  lakeId: string
}
