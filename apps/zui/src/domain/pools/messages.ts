import {CreatePoolOpts, LoadOpts} from "@brimdata/zed-js"
import {PoolUpdate} from "./types"
import {Update} from "@reduxjs/toolkit"
import {PoolSetting} from "src/js/state/PoolSettings/types"
import {newPool} from "./handlers"

export type PoolsOperations = {
  "pools.create": (
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => string // poolId

  "pools.update": (lakeId: string, update: PoolUpdate | PoolUpdate[]) => void
  "pools.load": (poolId: string, data: string, opts: Partial<LoadOpts>) => void
  "pools.createSettings": (id: string) => void
  "pools.updateSettings": (update: Update<PoolSetting>) => void
  "pools.getSettings": (id: string) => PoolSetting | null
}

export type PoolsHandlers = {
  "pools.new": typeof newPool
}
