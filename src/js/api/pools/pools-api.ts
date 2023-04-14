import {isArray} from "lodash"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"
import {createPool, deletePool, loadFiles} from "src/js/electron/ops"
import {CreatePoolOpts, LoadFormat} from "@brimdata/zed-js"

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

  async loadFiles(poolId: string, files: string[], format?: LoadFormat) {
    await loadFiles({
      lakeId: this.lakeId,
      poolId,
      branch: "main",
      files,
      format,
    })
  }

  async delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    for (let id of ids) {
      await deletePool(this.lakeId, id)
    }
  }

  async create(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const id = await createPool(this.lakeId, name, opts)
    await this.sync(id)
    return id
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
