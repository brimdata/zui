import {nanoid} from "@reduxjs/toolkit"
import {isArray} from "lodash"
import {CreatePoolOpts} from "packages/zealot/src"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import detectFileTypes from "src/js/brim/ingest/detectFileTypes"
import {FileListData} from "src/js/brim/ingest/fileList"
import {loadEnd, loadStart} from "src/js/electron/ops/loads-in-progress-op"
import deletePools from "src/js/flows/deletePools"
import Current from "src/js/state/Current"
import Loads from "src/js/state/Loads"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"

type Update = {id: string; changes: {name: string}}
export class PoolsApi extends ApiDomain {
  get all() {
    return this.select(Current.getPools)
  }

  get nameDelimiter() {
    return this.configs.get("pools", "nameDelimiter")
  }

  inGroup(group: string[]) {
    return this.all.filter((pool) =>
      new PoolName(pool.name, this.nameDelimiter).isIn(group)
    )
  }

  find(id: string) {
    return this.select(Pools.get(this.lakeId, id))
  }

  // TODO: Move to main progress, create a loads domain
  async loadFiles(poolId: string, files: File[], format?: string) {
    const fileListData = await detectFileTypes(files)
    const loader = chooseLoader(this, fileListData)
    const load = createLoad(this, this.lakeId, poolId)
    const params = {
      poolId: poolId,
      branch: "main",
      name: "",
      fileListData,
      format,
    }
    try {
      await load.setup()
      await loader.load(
        params,
        load.onProgress,
        load.onWarning,
        load.onPoolChanged,
        load.signal
      )
      await waitForPoolStats(this, poolId)
    } catch (e) {
      loader.unload && (await loader.unload(params))
      throw e
    } finally {
      load.teardown()
    }
  }

  delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    return this.dispatch(deletePools(ids))
  }

  async create(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const client = await this.zealot
    const res = await client.createPool(name, opts)
    await this.sync(res.pool.id)
    return res.pool.id
  }

  async update(update: Update | Update[]) {
    const client = await this.zealot
    for (let {id, changes} of isArray(update) ? update : [update]) {
      await client.updatePool(id, changes)
    }
    return this.syncAll()
  }

  async sync(id: string) {
    const client = await this.zealot
    const lakeId = this.lakeId
    const [data, stats] = await Promise.all([
      client.getPool(id),
      client.getPoolStats(id),
    ])
    this.dispatch(Pools.setData({lakeId, data}))
    this.dispatch(Pools.setStats({lakeId, poolId: id, stats}))
    return new Pool(data, stats)
  }

  async syncAll() {
    const client = await this.zealot
    const allData = await client.getPools()
    this.dispatch(Pools.setAllData({lakeId: this.lakeId, allData}))
  }
}

function createLoad(api: PoolsApi, lakeId: string, poolId: string) {
  const ctl = new AbortController()
  const id = nanoid()

  return {
    signal: ctl.signal,

    setup: async () => {
      await loadStart.invoke(global.windowId)
      api.abortables.add({id, abort: () => ctl.abort()})
      api.dispatch(Loads.create({id, poolId, progress: 0}))
    },

    teardown: async () => {
      await loadEnd.invoke(global.windowId)
      api.abortables.remove(id)
      api.dispatch(Loads.delete(id))
    },

    onProgress: (progress: number) => {
      api.dispatch(Loads.update({id, changes: {progress}}))
    },

    onWarning: (warning: string) => {
      api.dispatch(Pools.appendWarning({lakeId, poolId, warning}))
    },

    onPoolChanged: async () => {
      await api.sync(poolId)
    },
  }
}

function chooseLoader(api: PoolsApi, fileListData: FileListData) {
  const filesType = fileListData[0]?.type
  const loaders = api.loaders.getMatches(filesType)
  if (!loaders || loaders.length === 0) {
    throw new Error(
      `No registered loaders match the provided file type: ${filesType}`
    )
  }
  // only supporting one loader at this time
  return loaders[0]
}

async function waitForPoolStats(api: PoolsApi, poolId: string) {
  let tries = 0
  while (tries < 20) {
    tries++
    const pool = await api.sync(poolId)
    if (pool.hasStats() && pool.size > 0) break
    await new Promise((r) => setTimeout(r, 300))
  }
}
