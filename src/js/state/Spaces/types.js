/* @flow */

import type {Ts} from "../../brim"

export type SpacesState = {
  // clusterId
  [string]: {
    // spaceName
    [string]: Space
  }
}

export type SpacesAction =
  | SPACES_NAMES
  | SPACES_DETAIL
  | SPACES_PACKET_POST_STATUS

export type Space = {
  name: string,
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean,
  packet_post_status?: ?PacketPostStatus
}

export type PacketPostStatus = {
  start_time: Ts,
  update_time: Ts,
  packet_total_size: number,
  packet_read_size: number
}

export type SpaceDetailPayload = {|
  name: string,
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean
|}

export type SPACES_NAMES = {
  type: "SPACES_NAMES",
  clusterId: string,
  names: string[]
}

export type SPACES_DETAIL = {
  type: "SPACES_DETAIL",
  clusterId: string,
  space: SpaceDetailPayload
}

export type SPACES_PACKET_POST_STATUS = {
  type: "SPACES_PACKET_POST_STATUS",
  clusterId: string,
  space: string,
  status: PacketPostStatus
}
