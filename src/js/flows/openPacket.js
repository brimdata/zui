/* @flow */

import fsExtra from "fs-extra"

import type {PacketPostStatusPayload} from "../services/zealot/types"
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import ErrorFactory from "../models/ErrorFactory"
import Handlers from "../state/Handlers"
import Notice from "../state/Notice"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import brim from "../brim"
import deleteSpace from "./deleteSpace"
import errors from "../errors"
import lib from "../lib"

export default (
  file: string,
  clientDep: *,
  gDispatch: Function = globalDispatch
): Thunk => (dispatch, getState) => {
  let dir = file + ".brim"
  let clusterId = Tab.clusterId(getState())
  let tabId = Tabs.getActive(getState())
  let client = clientDep || Tab.getZealot(getState())
  let spaceName
  let handlerId = brim.randomHash()

  return fsExtra
    .ensureDir(dir)
    .then(() => client.spaces.create({data_dir: dir}))
    .then(async ({name}) => {
      spaceName = name
      dispatch(Search.setSpace(name, tabId))
      let stream = client.pcaps.post({space: name, path: file})
      dispatch(
        Handlers.register(handlerId, {
          type: "INGEST",
          spaceName
        })
      )
      let setProgress = (n) =>
        gDispatch(Spaces.setIngestProgress(clusterId, name, n))

      setProgress(0)
      for await (let {type, ...status} of stream) {
        if (type === "PacketPostStatus") {
          setProgress(extractFrom(status))
          gDispatch(Spaces.setDetail(clusterId, await client.spaces.get(name)))
        }
        if (type === "TaskEnd" && status.error) {
          throw errors.pcapIngest(status.error.error)
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
    .finally(() => dispatch(Handlers.remove(handlerId)))
}

function extractFrom(status: PacketPostStatusPayload): number {
  if (status.packet_total_size === 0) return 1
  else return status.packet_read_size / status.packet_total_size
}
