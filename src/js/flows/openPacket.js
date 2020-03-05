/* @flow */

import fsExtra from "fs-extra"

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
      let stream = client.pcaps.post({name, path: file})
      for await (let {type, ...rest} of stream) {
        if (type == "TaskStart") {
          dispatch(initSpace(name, client))
        }
        if (type === "PacketPostStatus") {
          dispatch(Spaces.setPacketPostStatus(id, name, rest))
        }
      }
    })
}
