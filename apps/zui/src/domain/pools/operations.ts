import {createOperation} from "src/core/operations"

import {CreatePoolOpts, LoadOpts} from "@brimdata/zed-js"
import {lake, pools} from "src/zui"
import PoolSettings from "src/js/state/PoolSettings"
import {getDefaults} from "src/js/state/PoolSettings/selectors"
import Pools from "src/js/state/Pools"
import {PoolUpdate} from "./types"
import {PoolSetting} from "src/js/state/PoolSettings/types"
import {Update} from "@reduxjs/toolkit"

export const create = createOperation(
  "pools.create",
  async (
    {main},
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => {
    const client = await main.createClient(lakeId)
    const {pool} = await client.createPool(name, opts)
    main.dispatch(Pools.setData({lakeId, data: pool}))
    pools.emit("create", {pool})
    return pool.id as string
  }
)

export const update = createOperation(
  "pools.update",
  async ({main}, lakeId: string, update: PoolUpdate | PoolUpdate[]) => {
    const client = await main.createClient(lakeId)
    for (let {id, changes} of Array.isArray(update) ? update : [update]) {
      await client.updatePool(id, changes)
    }
  }
)

export const deletePool = createOperation(
  "pools.delete",
  async ({main}, lakeId: string, id: string) => {
    const client = await main.createClient(lakeId)
    await client.deletePool(id)
    main.dispatch(Pools.remove({lakeId, poolId: id}))
  }
)

export const load = createOperation(
  "pools.load",
  async (_, poolId: string, data: string, options: Partial<LoadOpts>) => {
    return lake.client.load(data, {
      pool: poolId,
      ...options,
    })
  }
)

export const createSettings = createOperation(
  "pools.createSettings",
  async ({main}, id: string) => {
    main.store.dispatch(PoolSettings.create({id, ...getDefaults()}))
  }
)

export const updateSettings = createOperation(
  "pools.updateSettings",
  async ({main}, update: Update<PoolSetting>) => {
    main.store.dispatch(PoolSettings.update(update))
  }
)

export const getSettings = createOperation(
  "pools.getSettings",
  ({main}, id: string) => {
    return PoolSettings.find(main.store.getState(), id)
  }
)
