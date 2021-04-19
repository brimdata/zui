import {remote} from "electron"
import {join} from "path"
import {ZedPrimitive, ZedRecord} from "zealot/zed/data-types"
import {getZealot} from "../../flows/getZealot"
import {saveToFile} from "../../lib/response"
import Current from "../Current"
import Packets from "../Packets"
import {Thunk} from "../types"
import View from "../View"

export default {
  fetch: (log: ZedRecord): Thunk<Promise<string>> => (
    dispatch: Function,
    getState: Function
  ) => {
    dispatch(Packets.request(log["uid"].toString()))
    dispatch(View.showDownloads())
    const state = getState()
    const zealot = dispatch(getZealot())
    const spaceId = Current.getSpaceId(state)
    const ts = log.get("ts") as ZedPrimitive
    const dur = log.get("duration") as ZedPrimitive
    const args = {
      ts_sec: getSec(ts),
      ts_ns: getNs(ts),
      duration_sec: getSec(dur),
      duration_ns: getNs(dur),
      proto: log.get("proto").toString(),
      src_host: log.get("id.orig_h").toString(),
      src_port: log.get("id.orig_p").toString(),
      dst_host: log.get("id.resp_h").toString(),
      dst_port: log.get("id.resp_p").toString(),
      spaceId
    }
    const destDir = remote.app.getPath("temp")
    const dest = join(destDir, `packets-${args.ts_sec + args.ts_ns / 1e9}.pcap`)
    return zealot.pcaps
      .get(args)
      .then((resp) => saveToFile(resp, dest))
      .then((file) => {
        dispatch(Packets.receive(log.get("uid").toString(), file))
        return file
      })
      .catch((error) => {
        dispatch(Packets.error(log.get("uid").toString(), error))
        throw error
      })
      .finally(() => {
        setTimeout(() => dispatch(View.hideDownloads()), 5000)
      })
  }
}

function getSec(data: ZedPrimitive): number {
  if (data.isUnset()) return 0

  return parseInt(data.toString().split(".")[0])
}

function getNs(data: ZedPrimitive): number {
  if (data.isUnset()) return 0

  const v = data.toString().split(".")
  if (v.length === 2) {
    const frac = v[1]
    const digits = frac.length
    return parseInt(frac) * Math.pow(10, 9 - digits)
  } else {
    return 0
  }
}
