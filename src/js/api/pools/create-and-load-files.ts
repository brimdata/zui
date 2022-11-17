import {getPoolName} from "src/js/brim/ingest/getParams"
import {Thunk} from "src/js/state/types"
import {lakePoolPath} from "../../../app/router/utils/paths"
import detectFileTypes from "src/js/brim/ingest/detectFileTypes"

export const createAndLoadFilesThunk =
  (files: File[]): Thunk<Promise<void>> =>
  async (_, _gs, {api}) => {
    const lakeId = api.current.lakeId
    const tabId = api.current.tabId
    const poolNames = api.pools.all.map((p) => p.name)
    const filesData = await detectFileTypes(files)
    const name = getPoolName(filesData, poolNames)
    let poolId: string | null = null
    try {
      poolId = await api.pools.create(name)
      api.url.push(lakePoolPath(poolId, lakeId), {tabId})
      await api.pools.loadFiles(poolId, files)
    } catch (e) {
      if (poolId) await api.pools.delete(poolId)
      api.url.goBack({tabId})
      throw e
    }
  }
