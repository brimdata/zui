/* @flow */
import type {Ts} from "../../brim"

export type PacketPostStatusPayload = {|
  start_time: Ts,
  update_time: Ts,
  packet_total_size: number,
  packet_read_size: number
|}

export type SpaceDetailPayload = {|
  name: string,
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean
|}
