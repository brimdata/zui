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
      let setIsQueryable = (v) =>
        dispatch(Spaces.setIsQueryable(clusterId, name, v))

      setProgress(0)
      let isQueryable = false
      setIsQueryable(isQueryable)
      for await (let {type, ...status} of stream) {
        if (type === "PacketPostStatus") {
          setProgress(extractFrom(status))

          if (!isQueryable && status.packet_read_size > 0) {
            const data = await client.spaces.get(name)
            dispatch(Spaces.setDetail(clusterId, data))
            dispatch(
              Search.setSpanArgs(brim.space(data).defaultSpanArgs(), tabId)
            )
            dispatch(Search.setSpace(data.name, tabId))
            setIsQueryable((isQueryable = true))
          } else if (isQueryable) {
            const data = await client.spaces.get(name)
            dispatch(Spaces.setDetail(clusterId, data))
          }
        }
      }

      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here.
      setProgress(1)
      await lib.sleep(1500)
      setProgress(null)
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
