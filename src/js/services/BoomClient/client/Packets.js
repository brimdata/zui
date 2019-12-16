/* @flow */

import type {PacketArgs} from "../types"
import SubClient from "./SubClient"
import download from "../adapters/download"

export default class Packets extends SubClient {
  get(args: PacketArgs) {
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

    const dest = `${args.destDir}/packets-${args.ts_sec +
      args.ts_ns / 1e9}.pcap`
    const method = "GET"
    const path = `/space/${args.space}/packet?${params.toString()}`

    const {host, port, ...rest} = this.base.options

    if (!host || !port) throw "Missing host/port"

    return download({...rest, host, port, path, method}, dest)
  }
}
