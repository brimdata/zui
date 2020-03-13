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
import deleteSpace from "./deleteSpace"
import lib from "../lib"

export default (file: string, clientDep: *): Thunk => (dispatch, getState) => {
  let dir = file + ".brim"
  let clusterId = Tab.clusterId(getState())
  let tabId = Tabs.getActive(getState())
  let client = clientDep || Tab.getZealot(getState())
  let spaceName

  return fsExtra
    .ensureDir(dir)
    .then(() => client.spaces.create({data_dir: dir}))
    .then(async ({name}) => {
      spaceName = name
      dispatch(Search.setSpace(name, tabId))
      let stream = client.pcaps.post({space: name, path: file})
      let setProgress = (n) =>
        dispatch(Spaces.setIngestProgress(clusterId, name, n))

      setProgress(0)
      for await (let {type, ...status} of stream) {
        if (type === "PacketPostStatus") {
          setProgress(extractFrom(status))
          dispatch(Spaces.setDetail(clusterId, await client.spaces.get(name)))
        }
        if (type === "TaskEnd" && status.error) {
          throw status.error
        }
      }
      setProgress(1)
      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here.
      await lib.sleep(1500)
      setProgress(null)
    })
    .catch((e) => {
      if (spaceName) {
        dispatch(deleteSpace(spaceName))
          .then(() => {
            dispatch(Search.setSpace(""))
            throw e
          })
          .catch((e) => {
            dispatch(Notice.set(ErrorFactory.create(e)))
          })
      }
    })
}

function extractFrom(status: PacketPostStatusPayload): number {
  if (status.packet_total_size === 0) return 1
  else return status.packet_read_size / status.packet_total_size
}
