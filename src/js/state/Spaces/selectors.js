/* @flow */

import {keys} from "lodash"

import type {State} from "../types"

export default {
  names: (clusterId: string) => (state: State) =>
    keys<string>(state.spaces[clusterId]),

  get: (clusterId: string, name: string) => (state: State) =>
    state.spaces[clusterId][name],

  raw: (state: State) => state.spaces,

  getPacketPostStatus: (clusterId: string, name: string) => (state: State) => {
    let space = state.spaces[clusterId][name]
    if (space) return space.packet_post_status
  }
}
