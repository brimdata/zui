import {PoolConfig, PoolStats} from "@brimdata/zed-js"

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
