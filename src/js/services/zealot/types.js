/* @flow */
import type {Ts} from "../../brim"

export type SpanPayload = {
  ts: Ts,
  dur: Ts
}

export type PacketPostStatusPayload = {|
  span: SpanPayload,
  packet_total_size: number,
  packet_read_size: number
|}

export type SpaceDetailPayload = {|
  name: string,
  span: SpanPayload,
  packet_support: boolean
|}
