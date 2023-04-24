import {CreatePoolOpts} from "@brimdata/zed-js"
import {PoolUpdate} from "./types"

export type PoolsOperations = {
  "pools.create": (
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => Promise<string> // poolId

  "pools.update": (
    lakeId: string,
    update: PoolUpdate | PoolUpdate[]
  ) => Promise<void>
}
