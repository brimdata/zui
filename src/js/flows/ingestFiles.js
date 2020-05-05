/* @flow */
import {isEmpty} from "lodash"
import fsExtra from "fs-extra"

import type {Dispatch, Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Handlers from "../state/Handlers"
import Prefs from "../state/Prefs"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import brim from "../brim"
import errors from "../errors"
import ingest from "../brim/ingest"
import lib from "../lib"

export default (
  paths: string[],
  _client: *,
  gDispatch: Dispatch = globalDispatch
): Thunk => (dispatch, getState) => {
  let client = _client || Tab.getZealot(getState())
  let clusterId = Tab.clusterId(getState())
  let tabId = Tabs.getActive(getState())
  let requestId = brim.randomHash()
  let jsonTypeConfigPath = Prefs.getJSONTypeConfig(getState())

  return lib.transaction([
    validateInput(paths),
    createDir(),
    createSpace(client, gDispatch, clusterId),
    registerHandler(dispatch, requestId),
    postFiles(client, jsonTypeConfigPath),
    setSpace(dispatch, tabId),
    trackProgress(client, gDispatch, clusterId),
    unregisterHandler(dispatch, requestId)
  ])
}

const validateInput = (paths) => ({
  async do() {
    let params = await ingest
      .detectFileTypes(paths)
      .then(ingest.getParams)
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

const createSpace = (client, dispatch, clusterId) => ({
  async do(params) {
    let createParams
    if (params.dataDir) {
      createParams = {data_dir: params.dataDir}
    } else {
      createParams = {name: params.name}
    }
    let {name} = await client.spaces.create(createParams)
    dispatch(
      Spaces.setDetail(clusterId, {
        name,
        ingest: {progress: 0, snapshot: 0, warnings: []}
      })
    )

    return {...params, name}
  },
  async undo({name}) {
    await client.spaces.delete(name)
    dispatch(Spaces.remove(clusterId, name))
  }
})

const registerHandler = (dispatch, id) => ({
  do({name}) {
    let handle = {type: "INGEST", spaceName: name}
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
    let {name, endpoint, paths} = params
    let stream
    if (endpoint === "pcap") {
      stream = client.pcaps.post({space: name, path: paths[0]})
    } else {
      let types = isEmpty(jsonTypesPath)
        ? "default"
        : await lib.file(jsonTypesPath).read()
      stream = client.logs.post({space: name, paths, types})
    }
    return {...params, stream}
  }
})

const setSpace = (dispatch, tabId) => ({
  do({name}) {
    dispatch(Search.setSpace(name, tabId))
  },
  undo() {
    dispatch(Search.setSpace("", tabId))
  }
})

const trackProgress = (client, dispatch, clusterId) => {
  return {
    async do({name, stream, endpoint}) {
      let space = Spaces.actionsFor(clusterId, name)

      async function updateSpaceDetails() {
        let details = await client.spaces.get(name)
        dispatch(Spaces.setDetail(clusterId, details))
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

      dispatch(space.setIngestProgress(0))
      for await (let {type, ...status} of stream) {
        switch (type) {
          case "PcapPostStatus":
            dispatch(space.setIngestProgress(packetPostStatusToPercent(status)))
            dispatch(space.setIngestSnapshot(status.snapshot_count))
            if (status.snapshot_count > 0) updateSpaceDetails()
            break
          case "LogPostStatus":
            dispatch(space.setIngestProgress(logPostStatusToPercent(status)))
            updateSpaceDetails()
            break
          case "LogPostWarning":
            dispatch(space.appendIngestWarning(status.warning))
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
      dispatch(space.setIngestProgress(1))
      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here. It should be moved into the search
      // progress component
      await lib.sleep(1500)
      dispatch(space.setIngestProgress(null))
    }
  }
}
