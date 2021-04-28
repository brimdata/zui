import {lakePath, workspacesPath} from "app/router/utils/paths"
import fsExtra from "fs-extra"
import brim from "../brim"
import ingest from "../brim/ingest"
import {IngestParams} from "../brim/ingest/getParams"
import lib from "../lib"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import {Handler} from "../state/Handlers/types"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import SystemTest from "../state/SystemTest"
import Tabs from "../state/Tabs"
import {Dispatch, Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import BrimApi from "../api"
import {Zealot} from "../../../zealot"

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
  const dataDir = Prefs.getDataDir(getState())
  const spaceNames = Spaces.getSpaceNames(workspaceId)(getState())

  dispatch(SystemTest.hook("import-start"))
  return lib
    .transaction([
      validateInput(files, dataDir, spaceNames),
      createDir(),
      createSpace(zealot, dispatch, workspaceId),
      setSpace(dispatch, tabId, workspaceId),
      registerHandler(dispatch, requestId),
      executeLoader(zealot, dispatch, workspaceId, api),
      unregisterHandler(dispatch, requestId)
    ])
    .then(() => {
      dispatch(SystemTest.hook("import-complete"))
    })
}

const validateInput = (files: File[], dataDir, spaceNames) => ({
  async do() {
    const params = await ingest
      .detectFileTypes(files)
      .then((data) => ingest.getParams(data, dataDir, spaceNames))
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

const createSpace = (client, gDispatch, workspaceId) => ({
  async do(params: IngestParams) {
    let createParams
    if (params.dataDir) {
      createParams = {data_path: params.dataDir}
    } else {
      createParams = {name: params.name}
    }
    const space = await client.spaces.create(createParams)
    gDispatch(
      Spaces.setDetail(workspaceId, {
        ...space,
        ingest: {progress: 0, snapshot: 0, warnings: []}
      })
    )

    return {...params, spaceId: space.id}
  },
  async undo({spaceId}: IngestParams & {spaceId: string}) {
    await client.spaces.delete(spaceId)
    gDispatch(Spaces.remove(workspaceId, spaceId))
  }
})

const registerHandler = (dispatch, id) => ({
  do({spaceId}: IngestParams & {spaceId: string}) {
    const handle: Handler = {type: "INGEST", spaceId}
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
  api: BrimApi
) => ({
  async do(params: IngestParams & {spaceId: string}) {
    const {spaceId, fileListData = []} = params

    const space = Spaces.actionsFor(workspaceId, spaceId)

    const onProgressUpdate = (value: number | null): void => {
      dispatch(space.setIngestProgress(value))
    }
    const onDetailUpdate = async (): Promise<void> => {
      const details = await client.spaces.get(spaceId)
      dispatch(Spaces.setDetail(workspaceId, details))
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
    try {
      await l.load(params, onProgressUpdate, onWarning, onDetailUpdate)
    } catch (e) {
      l.unLoad && (await l.unLoad(params))
      throw e
    }
  }
})

const setSpace = (dispatch, tabId, workspaceId) => ({
  do({spaceId}) {
    const url = lakePath(spaceId, workspaceId)
    global.tabHistories.getOrCreate(tabId).push(url)
  },
  undo() {
    const url = workspacesPath()
    global.tabHistories.getOrCreate(tabId).replace(url)
  }
})
