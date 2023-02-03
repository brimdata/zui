import {PoolConfig, PoolStats} from "@brimdata/zealot/types"

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
