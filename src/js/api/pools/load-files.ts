import {Client} from "@brimdata/zealot"
import {createPool} from "src/app/core/pools/create-pool"
import {syncPool} from "src/app/core/pools/sync-pool"
import Ingests from "src/js/state/Ingests"
import Url from "src/js/state/Url"
import BrimApi from "src/js/api"
import brim from "src/js/brim"
import ingest from "src/js/brim/ingest"
import {IngestParams} from "src/js/brim/ingest/getParams"
import {getZealot} from "src/js/flows/getZealot"
import lib from "src/js/lib"
import Current from "src/js/state/Current"
import Handlers from "src/js/state/Handlers"
import {Handler} from "src/js/state/Handlers/types"
import Pools from "src/js/state/Pools"
import SystemTest from "src/js/state/SystemTest"
import Tabs from "src/js/state/Tabs"
import {Dispatch, Thunk} from "src/js/state/types"
import {lakePath, lakePoolPath} from "../../../app/router/utils/paths"

export default (files: File[]): Thunk<Promise<void>> =>
  async (dispatch, getState, {api}) => {
    const l = Current.mustGetLake(getState())
    const lakeId = l.id
    const zealot = await dispatch(getZealot())
    const tabId = Tabs.getActive(getState())
    const requestId = brim.randomHash()
    const poolNames = Pools.getPoolNames(lakeId)(getState())

    dispatch(SystemTest.hook("import-start"))
    return lib
      .transaction([
        validateInput(files, poolNames),
        newPool(zealot, dispatch, lakeId),
        registerIngest(dispatch, requestId),
        setPool(dispatch, tabId, lakeId),
        executeLoader(zealot, dispatch, lakeId, api, requestId),
        unregisterIngest(dispatch, requestId),
      ])
      .then(() => {
        dispatch(SystemTest.hook("import-complete"))
      })
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

const registerIngest = (dispatch, id) => ({
  do({poolId}: IngestParams & {poolId: string}) {
    const handle: Handler = {type: "INGEST", poolId}
    dispatch(Handlers.register(id, handle))
    dispatch(Ingests.create(poolId))
  },
  undo({poolId}) {
    dispatch(Handlers.remove(id))
    dispatch(Ingests.remove(poolId))
  },
})

const unregisterIngest = (dispatch, id) => ({
  do({poolId}) {
    dispatch(Handlers.remove(id))
    dispatch(Ingests.remove(poolId))
  },
})

const executeLoader = (
  client: Client,
  dispatch: Dispatch,
  lakeId: string,
  api: BrimApi,
  handlerId: string
) => ({
  async do(params: IngestParams & {poolId: string; branch: string}) {
    const {poolId, fileListData = []} = params

    const onProgressUpdate = (progress: number): void => {
      dispatch(Ingests.setProgress({poolId, progress}))
    }
    const onDetailUpdate = async (): Promise<void> => {
      dispatch(syncPool(poolId, lakeId))
    }
    const onWarning = (warning: string): void => {
      dispatch(Ingests.addWarning({poolId, warning}))
    }

    // for now, to find a loader match we will assume all files are the same
    // type
    const filesType = fileListData[0]?.type
    const loaders = api.loaders.getMatches(filesType)
    if (!loaders || loaders.length === 0) {
      throw new Error(
        `No registered loaders match the provided file type: ${filesType}`
      )
    }

    // only supporting one loader at this time
    const l = loaders[0]
    const abortCtl = new AbortController()

    const abortHandler = () => {
      abortCtl.abort()
    }
    const cleanup = api.loaders.setAbortHandler(handlerId, abortHandler)
    try {
      await l.load(
        params,
        onProgressUpdate,
        onWarning,
        onDetailUpdate,
        abortCtl.signal
      )
      // Wait for the pool to have some data before we signal that
      // the ingest is done.
      let tries = 0
      while (tries < 20) {
        tries++
        const pool = await dispatch(syncPool(poolId))
        if (pool.hasStats() && pool.size > 0) break
        await new Promise((r) => setTimeout(r, 300))
      }
    } catch (e) {
      l.unload && (await l.unload(params))
      throw e
    } finally {
      if (abortCtl.signal.aborted) api.loaders.didAbort(handlerId)
      cleanup()
    }
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
