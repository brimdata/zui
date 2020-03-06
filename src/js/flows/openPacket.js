/* @flow */

import fsExtra from "fs-extra"

import type {PacketPostStatusPayload} from "../services/zealot/types"
import type {Thunk} from "../state/types"
import {initSpace} from "./initSpace"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import zealot from "../services/zealot"

export default (file: string, clientDep: *): Thunk => (dispatch, getState) => {
  let dir = file + ".brim"
  let url = Tab.clusterUrl(getState())
  let id = Tab.clusterId(getState())
  let client = clientDep || zealot.client(url)

  return fsExtra
    .ensureDir(dir)
    .then(() => client.spaces.create({data_dir: dir}))
    .then(async ({name}) => {
      let stream = client.pcaps.post({space: name, path: file})
      for await (let {type, ...status} of stream) {
        if (type === "PacketPostStatus") {
          dispatch(Spaces.setIngestProgress(id, name, getProgress(status)))
        }
      }
      return name
    })
    .then((name) => dispatch(initSpace(name, client)))
}

function getProgress(status: PacketPostStatusPayload) {
  if (status.packet_total_size === 0) return 1
  else return status.packet_read_size / status.packet_total_size
}
