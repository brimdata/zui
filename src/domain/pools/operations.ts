import {createOperation} from "src/core/operations"

import {CreatePoolOpts, LoadOpts} from "@brimdata/zed-js"
import {lake} from "src/zui"
import PoolSettings from "src/js/state/PoolSettings"

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
    return pool.id as string
  }
)

export const update = createOperation(
  "pools.update",
  async ({main}, lakeId, update) => {
    const client = await main.createClient(lakeId)
    for (let {id, changes} of Array.isArray(update) ? update : [update]) {
      await client.updatePool(id, changes)
    }
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

export const updateSettings = createOperation(
  "pools.updateSettings",
  async ({main}, update) => {
    const dispatch = main.store.dispatch
    dispatch(PoolSettings.create({id: update.id as string}))
    dispatch(PoolSettings.update(update))
  }
)

export const getSettings = createOperation(
  "pools.getSettings",
  ({main}, id) => {
    return PoolSettings.find(main.store.getState(), id)
  }
)
