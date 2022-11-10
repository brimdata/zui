import {nanoid} from "@reduxjs/toolkit"
import {isArray} from "lodash"
import {createPool} from "src/app/core/pools/create-pool"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "src/app/features/sidebar/pools-section/pool-name"
import detectFileTypes from "src/js/brim/ingest/detectFileTypes"
import {loadEnd, loadStart} from "src/js/electron/ops/loads-in-progress-op"
import deletePools from "src/js/flows/deletePools"
import Current from "src/js/state/Current"
import Ingests from "src/js/state/Ingests"
import Pools from "src/js/state/Pools"
import {ApiDomain} from "../api-domain"
import {createAndLoadFiles} from "./create-and-load-files"

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

  createFromFiles(files: File[]) {
    return this.dispatch(createAndLoadFiles(files))
  }

  // TODO: The loading of files needs to be done in the main process if it uses node.
  // If we use the new web streams, then it can remain here.
  // Clean this up pleeezzz
  // Don't require a file list data
  async loadFiles(id: string, files: File[]) {
    // for now, to find a loader match we will assume all files are the same
    // type
    const fileListData = await detectFileTypes(files)
    const loadId = nanoid()
    const filesType = fileListData[0]?.type
    const loaders = this.loaders.getMatches(filesType)
    if (!loaders || loaders.length === 0) {
      throw new Error(
        `No registered loaders match the provided file type: ${filesType}`
      )
    }
    // only supporting one loader at this time
    const l = loaders[0]
    const abortCtl = new AbortController()

    this.dispatch(Ingests.create(id))
    const abortHandler = () => {
      abortCtl.abort()
    }
    const cleanup = this.loaders.setAbortHandler(loadId, abortHandler)
    const params = {poolId: id, branch: "main", name: "", fileListData}
    await loadStart.invoke(global.windowId)
    try {
      await l.load(
        params,
        (progress: number) => {
          // on progress
          this.dispatch(Ingests.setProgress({poolId: id, progress}))
        },
        (warning: string): void => {
          // on warning
          this.dispatch(Ingests.addWarning({poolId: id, warning}))
        },
        () => this.sync(id).then(() => {}), // on detail update
        abortCtl.signal
      )
      // Wait for the pool to have some data before we signal that
      // the ingest is done.
      let tries = 0
      while (tries < 20) {
        tries++
        const pool = await this.sync(id)
        if (pool.hasStats() && pool.size > 0) break
        await new Promise((r) => setTimeout(r, 300))
      }
    } catch (e) {
      l.unload && (await l.unload(params))
      throw e
    } finally {
      await loadEnd.invoke(global.windowId)
      this.dispatch(Ingests.remove(id))
      if (abortCtl.signal.aborted) this.loaders.didAbort(loadId)
      cleanup()
    }
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
