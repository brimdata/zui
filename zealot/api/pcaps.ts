import {PcapsGetArgs, PcapsPostArgs} from "../types"

export default {
  get(args: PcapsGetArgs) {
    const params = new URLSearchParams()
    params.set("ts_sec", args.ts_sec.toString())
    params.set("ts_ns", args.ts_ns.toString())
    params.set("duration_sec", args.duration_sec.toString())
    params.set("duration_ns", args.duration_ns.toString())
    params.set("proto", args.proto)
    params.set("src_host", args.src_host)
    params.set("src_port", args.src_port)
    params.set("dst_host", args.dst_host)
    params.set("dst_port", args.dst_port)
    const query = params.toString()
    return {
      method: "GET",
      path: `/space/${encodeURIComponent(args.spaceId)}/pcap?${query}`
    }
  },
  post({spaceId, path}: PcapsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/pcap`,
      body: JSON.stringify({path})
    }
  }
}
