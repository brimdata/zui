/* @flow */
import {join} from "path"
import {remote} from "electron"

import type {Thunk} from "../types"
import {saveToFile} from "../../lib/response"
import Current from "../Current"
import Log from "../../models/Log"
import Packets from "../Packets"
import View from "../View"

export default {
  fetch: (log: Log): Thunk => (
    dispatch: Function,
    getState: Function,
    {createZealot}
  ) => {
    dispatch(Packets.request(log.getString("uid")))
    dispatch(View.showDownloads())
    const state = getState()
    const zealot = createZealot(Current.getConnectionId(state))
    const spaceId = Current.getSpaceId(state)
    const args = {
      ts_sec: log.getSec("ts"),
      ts_ns: log.getNs("ts"),
      duration_sec: log.getSec("duration"),
      duration_ns: log.getNs("duration"),
      proto: log.getString("proto"),
      src_host: log.getString("id.orig_h"),
      src_port: log.getString("id.orig_p"),
      dst_host: log.getString("id.resp_h"),
      dst_port: log.getString("id.resp_p"),
      spaceId
    }
    const destDir = remote.app.getPath("temp")
    const dest = join(destDir, `packets-${args.ts_sec + args.ts_ns / 1e9}.pcap`)
    return zealot.pcaps
      .get(args)
      .then((resp) => saveToFile(resp, dest))
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
