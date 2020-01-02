/* @flow */

import type {Ts} from "../../brim"

export type SpacesState = {
  // clusterId
  [string]: {
    // spaceName
    [string]: Space
  }
}

export type SpacesAction = SPACES_NAMES | SPACES_DETAIL

export type Space = {
  name: string,
  flush_timeout: number,
  close_timeout: number,
  slab_threshold: number,
  slab_fanout: number,
  max_writers: number,
  min_time: Ts,
  max_time: Ts,
  size: number,
  packet_support: boolean,
  compression: string,
  path: string
}

export type SPACES_NAMES = {
  type: "SPACES_NAMES",
  clusterId: string,
  names: string[]
}

export type SPACES_DETAIL = {
  type: "SPACES_DETAIL",
  clusterId: string,
  space: Space
}
