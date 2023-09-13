import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"
import {CreatePoolOpts, LoadFormat} from "@brimdata/zed-js"
import {invoke} from "src/core/invoke"
import {PoolUpdate} from "src/domain/pools/types"

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

  async loadFiles(poolId: string, files: string[], format?: LoadFormat) {
    await invoke("loadFilesOp", {
      windowId: globalThis.windowId,
      lakeId: this.lakeId,
      poolId,
      branch: "main",
      files,
      shaper: "*",
      author: "Zui",
      body: "App Import",
      format,
    })
  }

  async delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    for (let id of ids) {
      await invoke("deletePoolOp", this.lakeId, id)
    }
  }

  async create(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const id = await invoke("pools.create", this.lakeId, name, opts)
    await this.sync(id)
    return id
  }

  async update(update: PoolUpdate | PoolUpdate[]) {
    await invoke("pools.update", this.lakeId, update)
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
