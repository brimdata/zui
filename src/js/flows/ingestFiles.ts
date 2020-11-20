import {isEmpty} from "lodash"
import fsExtra from "fs-extra"

import {Thunk} from "../state/types"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import brim from "../brim"
import errors from "../errors"
import ingest from "../brim/ingest"
import lib from "../lib"
import {getZealot} from "./getZealot"
import {Handler} from "../state/Handlers/types"
import {IngestParams} from "../brim/ingest/getParams"

export default (files: File[]): Thunk<Promise<void>> => (
  dispatch,
  getState,
  {globalDispatch}
) => {
  const conn = Current.mustGetConnection(getState())
  const clusterId = conn.id
  const zealot = dispatch(getZealot())
  const tabId = Tabs.getActive(getState())
  const requestId = brim.randomHash()
  const jsonTypeConfigPath = Prefs.getJSONTypeConfig(getState())
  const dataDir = Prefs.getDataDir(getState())
  const spaceNames = Spaces.getSpaceNames(clusterId)(getState())

  return lib.transaction([
    validateInput(files, dataDir, spaceNames),
    createDir(),
    createSpace(zealot, globalDispatch, clusterId),
    setSpace(dispatch, tabId),
    registerHandler(dispatch, requestId),
    postFiles(zealot, conn, jsonTypeConfigPath),
    trackProgress(zealot, globalDispatch, clusterId),
    unregisterHandler(dispatch, requestId)
  ])
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

const createSpace = (client, gDispatch, clusterId) => ({
  async do(params: IngestParams) {
    let createParams
    if (params.dataDir) {
      createParams = {data_path: params.dataDir}
    } else {
      createParams = {name: params.name}
    }
    const space = await client.spaces.create(createParams)
    gDispatch(
      Spaces.setDetail(clusterId, {
        ...space,
        ingest: {progress: 0, snapshot: 0, warnings: []}
      })
    )

    return {...params, spaceId: space.id}
  },
  async undo({spaceId}: IngestParams & {spaceId: string}) {
    await client.spaces.delete(spaceId)
    gDispatch(Spaces.remove(clusterId, spaceId))
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

const postFiles = (client, conn, jsonTypesPath) => ({
  async do(params: IngestParams & {spaceId: string}) {
    const {spaceId, endpoint, files} = params
    const paths = files.map((f) => f.path)
    let stream
    if (endpoint === "pcap") {
      try {
        stream = await client.pcaps.post({spaceId, path: paths[0]})
      } catch (e) {
        if (e.name == "item does not exist") {
          e.message = "File " + e.message + " does not exist on " + conn.name
        }
        throw e
      }
    } else {
      const types = isEmpty(jsonTypesPath)
        ? undefined
        : await lib
            .file(jsonTypesPath)
            .read()
            .then(JSON.parse)
      stream = await client.logs.post({spaceId, files, types})
    }
    return {...params, stream}
  }
})

const setSpace = (dispatch, tabId) => ({
  do({spaceId}) {
    dispatch(Current.setSpaceId(spaceId, tabId))
  },
  undo() {
    dispatch(Current.setSpaceId(null, tabId))
  }
})

const trackProgress = (client, gDispatch, clusterId) => {
  return {
    async do({spaceId, stream, endpoint}) {
      const space = Spaces.actionsFor(clusterId, spaceId)

      async function updateSpaceDetails() {
        const details = await client.spaces.get(spaceId)
        gDispatch(Spaces.setDetail(clusterId, details))
      }

      function packetPostStatusToPercent(status): number {
        if (status.pcap_total_size === 0) return 1
        else return status.pcap_read_size / status.pcap_total_size || 0
      }

      gDispatch(space.setIngestProgress(0))
      for await (const {type, ...status} of stream) {
        switch (type) {
          case "PcapPostStatus":
            gDispatch(
              space.setIngestProgress(packetPostStatusToPercent(status))
            )
            gDispatch(space.setIngestSnapshot(status.snapshot_count))
            if (status.snapshot_count > 0) updateSpaceDetails()
            break
          case "UploadProgress":
            gDispatch(space.setIngestProgress(status.progress))
            updateSpaceDetails()
            break
          case "LogPostResponse":
            updateSpaceDetails()
            status.warnings.forEach((warning) => {
              gDispatch(space.appendIngestWarning(warning))
            })
            break
          case "LogPostWarning":
          case "PcapPostWarning":
            gDispatch(space.appendIngestWarning(status.warning))
            break
          case "TaskEnd":
            if (status.error) {
              if (endpoint === "pcap") {
                throw errors.pcapIngest(status.error.error)
              } else {
                throw errors.logsIngest(status.error.error)
              }
            }
            break
        }
      }
      gDispatch(space.setIngestProgress(1))
      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here. It should be moved into the search
      // progress component
      await lib.sleep(1500)
      gDispatch(space.setIngestProgress(null))
    }
  }
}
