import {Client} from "@brimdata/zealot"
import {createPool} from "src/app/core/pools/create-pool"
import Url from "src/js/state/Url"
import BrimApi from "src/js/api"
import ingest from "src/js/brim/ingest"
import {IngestParams} from "src/js/brim/ingest/getParams"
import lib from "src/js/lib"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {lakePath, lakePoolPath} from "../../../app/router/utils/paths"

export const createAndLoadFiles =
  (files: File[]): Thunk<Promise<void>> =>
  async (dispatch, getState, {api}) => {
    const l = Current.mustGetLake(getState())
    const lakeId = l.id
    const zealot = await api.getZealot()
    const tabId = Tabs.getActive(getState())

    const poolNames = Pools.getPoolNames(lakeId)(getState())

    return lib.transaction([
      validateInput(files, poolNames),
      newPool(zealot, dispatch, lakeId),
      setPool(dispatch, tabId, lakeId),
      executeLoader(api, files),
    ])
  }

const validateInput = (files: File[], poolNames) => ({
  async do() {
    const params = await ingest
      .detectFileTypes(files)
      .then((data) => ingest.getParams(data, poolNames))
      .catch((e) => {
        if (e.message.startsWith("EISDIR"))
          throw new Error(
            "Importing directories is not yet supported. Select multiple files."
          )
        else throw e
      })
    if ("error" in params) throw new Error(params.error)
    return params
  },
})

const newPool = (client: Client, dispatch, lakeId) => ({
  async do(params: IngestParams) {
    const id = await dispatch(createPool({name: params.name}))
    return {...params, poolId: id, branch: "main"}
  },
  async undo({poolId}: IngestParams & {poolId: string}) {
    await client.deletePool(poolId)
    dispatch(Pools.remove({lakeId, poolId}))
  },
})

const setPool = (dispatch, tabId, lakeId) => ({
  do({poolId}) {
    const url = lakePoolPath(poolId, lakeId)
    global.tabHistories.getOrCreate(tabId).push(url)
    dispatch(Url.changed())
  },
  undo() {
    const url = lakePath(lakeId)
    global.tabHistories.getOrCreate(tabId).replace(url)
    dispatch(Url.changed())
  },
})

const executeLoader = (api: BrimApi, files: File[]) => ({
  async do(params: IngestParams & {poolId: string}) {
    await api.pools.loadFiles(params.poolId, files)
  },
})
