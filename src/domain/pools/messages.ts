import {CreatePoolOpts, LoadOpts} from "@brimdata/zed-js"
import {PoolUpdate} from "./types"

export type PoolsOperations = {
  "pools.create": (
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => string // poolId

  "pools.update": (lakeId: string, update: PoolUpdate | PoolUpdate[]) => void
  "pools.load": (poolId: string, data: string, opts: Partial<LoadOpts>) => void
}
