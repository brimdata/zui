import {Client} from "@brimdata/zealot"
import {lakePath, workspacePath} from "app/router/utils/paths"
import Url from "src/js/state/Url"
import BrimApi from "../../../src/js/api"
import brim from "../../../src/js/brim"
import ingest from "../../../src/js/brim/ingest"
import {IngestParams} from "../../../src/js/brim/ingest/getParams"
import interop from "../../../src/js/brim/interop"
import {getZealot} from "../../../src/js/flows/getZealot"
import lib from "../../../src/js/lib"
import Current from "../../../src/js/state/Current"
import Handlers from "../../../src/js/state/Handlers"
import {Handler} from "../../../src/js/state/Handlers/types"
import Pools from "../../../src/js/state/Pools"
import SystemTest from "../../../src/js/state/SystemTest"
import Tabs from "../../../src/js/state/Tabs"
import {Dispatch, Thunk} from "../../../src/js/state/types"

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
  const poolNames = Pools.getPoolNames(workspaceId)(getState())

  dispatch(SystemTest.hook("import-start"))
  return lib
    .transaction([
      validateInput(files, poolNames),
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
  }
})

const createPool = (client: Client, gDispatch, workspaceId) => ({
  async do(params: IngestParams) {
    const {pool, branch} = await client.createPool(params.name)
    gDispatch(
      Pools.setDetail(workspaceId, {
        ...pool,
        ingest: {progress: 0, warnings: []}
      })
    )
    return {...params, poolId: pool.id, branch: branch.name}
  },
  async undo({poolId}: IngestParams & {poolId: string}) {
    await client.deletePool(poolId)
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
  client: Client,
  dispatch: Dispatch,
  workspaceId: string,
  api: BrimApi,
  handlerId: string
) => ({
  async do(params: IngestParams & {poolId: string; branch: string}) {
    const {poolId, fileListData = []} = params

    const space = Pools.actionsFor(workspaceId, poolId)

    const onProgressUpdate = (value: number | null): void => {
      dispatch(space.setIngestProgress(value))
    }
    const onDetailUpdate = async (): Promise<void> => {
      const stats = interop.poolStatsPayloadToPool(
        await client.getPoolStats(poolId)
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
    dispatch(Url.changed())
  },
  undo() {
    const url = workspacePath(workspaceId)
    global.tabHistories.getOrCreate(tabId).replace(url)
    dispatch(Url.changed())
  }
})
