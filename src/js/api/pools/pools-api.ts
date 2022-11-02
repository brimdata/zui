import {isArray} from "lodash"
import {createPool} from "src/app/core/pools/create-pool"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import deletePools from "src/js/flows/deletePools"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"
import {load} from "./load"

type Update = {id: string; changes: {name: string}}
export class PoolsApi extends ApiDomain {
  get all() {
    return this.select(Current.getPools)
  }

  get nameDelimeter() {
    return this.configs.get("pools", "nameDelimeter")
  }

  inGroup(group: string[]) {
    return this.all.filter((pool) =>
      new PoolName(pool.name, this.nameDelimeter).isIn(group)
    )
  }

  find(id: string) {
    return this.select(Pools.get(this.lakeId, id))
  }

  load(files: File[]) {
    return this.dispatch(load(files))
  }

  delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    return this.dispatch(deletePools(ids))
  }

  create(name: string) {
    return this.dispatch(createPool({name}))
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
