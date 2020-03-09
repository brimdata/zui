/* @flow */

import fsExtra from "fs-extra"

import type {PacketPostStatusPayload} from "../services/zealot/types"
import type {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import brim from "../brim"
import lib from "../lib"
import zealot from "../services/zealot"

export default (file: string, clientDep: *): Thunk => (dispatch, getState) => {
  let dir = file + ".brim"
  let url = Tab.clusterUrl(getState())
  let clusterId = Tab.clusterId(getState())
  let tabId = Tabs.getActive(getState())
  let client = clientDep || zealot.client(url)

  return fsExtra
    .ensureDir(dir)
    .then(() => client.spaces.create({data_dir: dir}))
    .then(async ({name}) => {
      dispatch(Search.setSpace(name))
      let stream = client.pcaps.post({space: name, path: file})
      let setProgress = (n) =>
        dispatch(Spaces.setIngestProgress(clusterId, name, n))

      setProgress(0)
      for await (let {type, ...status} of stream) {
        if (type === "PacketPostStatus") setProgress(extractFrom(status))
      }
      setProgress(1)
      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here.
      await lib.sleep(1500)
      setProgress(null)
      return name
    })
    .then((name) => client.spaces.get(name))
    .then((data) => {
      dispatch(Spaces.setDetail(clusterId, data))
      dispatch(Search.setSpace(data.name, tabId))
      dispatch(Search.setSpanArgs(brim.space(data).defaultSpanArgs(), tabId))
    })
    .catch((e) => {
      // Delete the space from the backend here...
      dispatch(Search.setSpace(""))
      dispatch(Notice.set(ErrorFactory.create(e)))
    })
}

function extractFrom(status: PacketPostStatusPayload): number {
  if (status.packet_total_size === 0) return 1
  else return status.packet_read_size / status.packet_total_size
}
