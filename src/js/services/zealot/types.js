/* @flow */
import type {Ts} from "../../brim"

export type SpanPayload = {
  ts: Ts,
  dur: Ts
}

export type PcapPostStatusPayload = {|
  span: SpanPayload,
  pcap_total_size: number,
  pcap_read_size: number
|}

export type SpaceDetailPayload = {|
  name: string,
  span: SpanPayload,
  pcap_support: boolean
|}
