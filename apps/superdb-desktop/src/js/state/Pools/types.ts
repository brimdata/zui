import {PoolConfig, PoolStats} from "../../../../../../packages/superdb-types/dist"

export type PoolState = {
  data: PoolConfig
  stats: PoolStats
  warnings: string[]
}

export type PoolsState = {
  // lakeId
  [key: string]: {
    // poolId
    [key: string]: PoolState
  }
}
