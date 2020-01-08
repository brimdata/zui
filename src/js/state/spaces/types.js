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
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean
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
