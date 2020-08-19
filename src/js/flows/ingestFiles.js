/* @flow */
import {isEmpty} from "lodash"
import fsExtra from "fs-extra"

import type {Dispatch, Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import brim from "../brim"
import errors from "../errors"
import ingest from "../brim/ingest"
import lib from "../lib"

export default (
  paths: string[],
  gDispatch: Dispatch = globalDispatch
): Thunk => (dispatch, getState, {createZealot}) => {
  const conn = Current.mustGetConnection(getState())
  const clusterId = conn.id
  const zealot = createZealot(clusterId)
  const tabId = Tabs.getActive(getState())
  const requestId = brim.randomHash()
  const jsonTypeConfigPath = Prefs.getJSONTypeConfig(getState())
  const dataDir = Prefs.getDataDir(getState())
  const spaceNames = Spaces.getSpaceNames(clusterId)(getState())

  return lib.transaction([
    validateInput(paths, dataDir, spaceNames),
    createDir(),
    createSpace(zealot, gDispatch, clusterId),
    registerHandler(dispatch, requestId),
    postFiles(zealot, jsonTypeConfigPath),
    setSpace(dispatch, tabId),
    trackProgress(zealot, gDispatch, clusterId),
    unregisterHandler(dispatch, requestId)
  ])
}

const validateInput = (paths, dataDir, spaceNames) => ({
  async do() {
    let params = await ingest
      .detectFileTypes(paths)
      .then((data) => ingest.getParams(data, dataDir, spaceNames))
      .catch((e) => {
        if (e.message.startsWith("EISDIR"))
          throw new Error(
            "Importing directories is not yet supported. Select multiple files."
          )
        else throw e
      })
    if (params.error) throw new Error(params.error)
    return params
  }
})

const createDir = () => ({
  async do({dataDir}) {
    dataDir && (await fsExtra.ensureDir(dataDir))
  },
  async undo({dataDir}) {
    dataDir && (await fsExtra.remove(dataDir))
  }
})

const createSpace = (client, gDispatch, clusterId) => ({
  async do(params) {
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
  async undo({spaceId}) {
    await client.spaces.delete(spaceId)
    gDispatch(Spaces.remove(clusterId, spaceId))
  }
})

const registerHandler = (dispatch, id) => ({
  do({spaceId}) {
    let handle = {type: "INGEST", spaceId}
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

const postFiles = (client, jsonTypesPath) => ({
  async do(params) {
    let {spaceId, endpoint, paths} = params
    let stream
    if (endpoint === "pcap") {
      stream = await client.pcaps.post({spaceId, path: paths[0]})
    } else {
      let types = isEmpty(jsonTypesPath)
        ? undefined
        : await lib
            .file(jsonTypesPath)
            .read()
            .then(JSON.parse)
      stream = await client.logs.post({spaceId, paths, types})
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
      let space = Spaces.actionsFor(clusterId, spaceId)

      async function updateSpaceDetails() {
        let details = await client.spaces.get(spaceId)
        gDispatch(Spaces.setDetail(clusterId, details))
      }

      function packetPostStatusToPercent(status): number {
        if (status.pcap_total_size === 0) return 1
        else return status.pcap_read_size / status.pcap_total_size || 0
      }

      function logPostStatusToPercent(status): number {
        // log_total_size may not be present
        if (!status.log_total_size) return 1
        else return status.log_read_size / status.log_total_size
      }

      gDispatch(space.setIngestProgress(0))
      for await (let {type, ...status} of stream) {
        switch (type) {
          case "PcapPostStatus":
            gDispatch(
              space.setIngestProgress(packetPostStatusToPercent(status))
            )
            gDispatch(space.setIngestSnapshot(status.snapshot_count))
            if (status.snapshot_count > 0) updateSpaceDetails()
            break
          case "LogPostStatus":
            gDispatch(space.setIngestProgress(logPostStatusToPercent(status)))
            updateSpaceDetails()
            break
          case "LogPostWarning":
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
