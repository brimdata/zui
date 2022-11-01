import {createPool} from "src/app/core/pools/create-pool"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import deletePools from "src/js/flows/deletePools"
import Config from "src/js/state/Config"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"
import {load} from "./load"

export class PoolsApi extends ApiDomain {
  get all() {
    return this.select(Current.getPools)
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

  async update(update: {id: string; changes: {name: string}}) {
    const client = await this.zealot
    await client.updatePool(update.id, update.changes)
    return this.sync(update.id)
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

  async renameGroup(update: {group: string[]; changes: {group: string[]}}) {
    const client = await this.zealot
    const delimeter = this.select(Config.getPoolNameDelimeter)
    const decendents = this.all.filter((pool) => {
      const name = new PoolName(pool.name, delimeter)
      return name.within(update.group)
    })
    const level = update.group.length - 1
    const prevName = update.group[level]
    const newName = update.changes.group[level]
    for (let pool of decendents) {
      const poolName = new PoolName(pool.name, delimeter)
      const group = poolName.group
      group[level] = group[level].replace(prevName, newName)
      const name = group.join(delimeter)
      await client.updatePool(pool.id, {name})
    }
    await this.syncAll()
  }

  async syncAll() {
    const client = await this.zealot
    const allData = await client.getPools()
    this.dispatch(Pools.setAllData({lakeId: this.lakeId, allData}))
  }
}
