/* @flow */

import {downloadsDir} from "../../lib/System"
import BoomClient from "../../services/BoomClient"
import Log from "../../models/Log"
import Packets from "../Packets"
import Tab from "../Tab"
import View from "../View"

export const fetchPackets = (log: Log) => (
  dispatch: Function,
  getState: Function,
  boom: BoomClient
) => {
  dispatch(Packets.request(log.get("uid")))
  dispatch(View.showDownloads())
  const state = getState()
  const space = Tab.spaceName(state)
  const destDir = downloadsDir()
  return boom.packets
    .get({
      ts_sec: log.getSec("ts"),
      ts_ns: log.getNs("ts"),
      duration_sec: log.getSec("duration"),
      duration_ns: log.getNs("duration"),
      proto: log.get("proto"),
      src_host: log.get("id.orig_h"),
      src_port: log.get("id.orig_p"),
      dst_host: log.get("id.resp_h"),
      dst_port: log.get("id.resp_p"),
      space,
      destDir
    })
    .then((file) => {
      dispatch(Packets.receive(log.get("uid"), file))
      return file
    })
    .catch((error) => {
      dispatch(Packets.error(log.get("uid"), error))
    })
    .finally(() => {
      setTimeout(() => dispatch(View.hideDownloads()), 5000)
    })
}
