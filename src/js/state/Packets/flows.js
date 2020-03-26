/* @flow */

import {downloadsDir} from "../../lib/System"
import BoomClient from "../../services/BoomClient"
import Log from "../../models/Log"
import Packets from "../Packets"
import Tab from "../Tab"
import View from "../View"

export default {
  fetch: (log: Log) => (
    dispatch: Function,
    getState: Function,
    boom: BoomClient
  ) => {
    dispatch(Packets.request(log.getString("uid")))
    dispatch(View.showDownloads())
    const state = getState()
    const space = Tab.spaceName(state)
    const destDir = downloadsDir()

    console.log("DEBUG: ", space, destDir, log.getFields())
    return boom.packets
      .get({
        ts_sec: log.getSec("ts"),
        ts_ns: log.getNs("ts"),
        duration_sec: log.getSec("duration"),
        duration_ns: log.getNs("duration"),
        proto: log.getString("proto"),
        src_host: log.getString("id.orig_h"),
        src_port: log.getString("id.orig_p"),
        dst_host: log.getString("id.resp_h"),
        dst_port: log.getString("id.resp_p"),
        space,
        destDir
      })
      .then((file) => {
        dispatch(Packets.receive(log.getString("uid"), file))
        return file
      })
      .catch((error) => {
        dispatch(Packets.error(log.getString("uid"), error))
        throw error
      })
      .finally(() => {
        setTimeout(() => dispatch(View.hideDownloads()), 5000)
      })
  }
}
