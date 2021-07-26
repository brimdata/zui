import {lakePath, workspacePath} from "app/router/utils/paths"
import fsExtra from "fs-extra"
import brim from "../brim"
import ingest from "../brim/ingest"
import {IngestParams} from "../brim/ingest/getParams"
import lib from "../lib"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import {Handler} from "../state/Handlers/types"
import Pools from "../state/Pools"
import SystemTest from "../state/SystemTest"
import Tabs from "../state/Tabs"
import {Dispatch, Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import BrimApi from "../api"
import {Zealot} from "../../../zealot"
import interop from "../brim/interop"
import ConfigPropValues from "../state/ConfigPropValues"

export default (files: File[]): Thunk<Promise<void>> => (
  dispatch,
  getState,
  {api}
) => {
  const ws = Current.mustGetWorkspace(getState())
  const workspaceId = ws.id
  const zealot = dispatch(getZealot())
  const tabId = Tabs.getActive(getState())
  const requestId = brim.randomHash()
  const dataDir = ConfigPropValues.get("display", "dataDir")(getState())
  const poolNames = Pools.getPoolNames(workspaceId)(getState())

  dispatch(SystemTest.hook("import-start"))
  return lib
    .transaction([
      validateInput(files, dataDir, poolNames),
      createDir(),
      createPool(zealot, dispatch, workspaceId),
      setPool(dispatch, tabId, workspaceId),
      registerHandler(dispatch, requestId),
      executeLoader(zealot, dispatch, workspaceId, api, requestId),
      unregisterHandler(dispatch, requestId)
    ])
    .then(() => {
      dispatch(SystemTest.hook("import-complete"))
    })
}

const validateInput = (files: File[], dataDir, poolNames) => ({
  async do() {
    const params = await ingest
      .detectFileTypes(files)
      .then((data) => ingest.getParams(data, dataDir, poolNames))
      .catch((e) => {
        if (e.message.startsWith("EISDIR"))
          throw new Error(
            "Importing directories is not yet supported. Select multiple files."
          )
        else throw e
      })
    if ("error" in params) throw new Error(params.error)
    return params
  }
})

const createDir = () => ({
  async do({dataDir}: IngestParams) {
    dataDir && (await fsExtra.ensureDir(dataDir))
  },
  async undo({dataDir}: IngestParams) {
    dataDir && (await fsExtra.remove(dataDir))
  }
})

const createPool = (client: Zealot, gDispatch, workspaceId) => ({
  async do(params: IngestParams) {
    let createParams
    if (params.dataDir) {
      createParams = {data_path: params.dataDir}
    } else {
      createParams = {name: params.name}
    }
    const pool = await client.pools.create(createParams)
    gDispatch(
      Pools.setDetail(workspaceId, {
        ...pool,
        ingest: {progress: 0, warnings: []}
      })
    )

    return {...params, poolId: pool.id}
  },
  async undo({poolId}: IngestParams & {poolId: string}) {
    await client.pools.delete(poolId)
    gDispatch(Pools.remove(workspaceId, poolId))
  }
})

const registerHandler = (dispatch, id) => ({
  do({poolId}: IngestParams & {poolId: string}) {
    const handle: Handler = {type: "INGEST", poolId}
    dispatch(Handlers.register(id, handle))
  },
  undo() {
    dispatch(Handlers.remove(id))
  }
})

const unregisterHandler = (dispatch, id) => ({
  do() {
    dispatch(Handlers.remove(id))
  }
})

const executeLoader = (
  client: Zealot,
  dispatch: Dispatch,
  workspaceId: string,
  api: BrimApi,
  handlerId: string
) => ({
  async do(params: IngestParams & {poolId: string}) {
    const {poolId, fileListData = []} = params

    const space = Pools.actionsFor(workspaceId, poolId)

    const onProgressUpdate = (value: number | null): void => {
      dispatch(space.setIngestProgress(value))
    }
    const onDetailUpdate = async (): Promise<void> => {
      const stats = interop.poolStatsPayloadToPool(
        await client.pools.stats(poolId)
      )
      dispatch(Pools.setDetail(workspaceId, {id: poolId, ...stats}))
    }
    const onWarning = (warning: string): void => {
      dispatch(space.appendIngestWarning(warning))
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
    } catch (e) {
      l.unload && (await l.unload(params))
      throw e
    } finally {
      if (abortCtl.signal.aborted) api.loaders.didAbort(handlerId)
      cleanup()
    }
  }
})

const setPool = (dispatch, tabId, workspaceId) => ({
  do({poolId}) {
    const url = lakePath(poolId, workspaceId)
    global.tabHistories.getOrCreate(tabId).push(url)
  },
  undo() {
    const url = workspacePath(workspaceId)
    global.tabHistories.getOrCreate(tabId).replace(url)
  }
})
