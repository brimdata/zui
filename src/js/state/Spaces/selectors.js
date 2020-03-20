/* @flow */

import {keys, values} from "lodash"

import type {State} from "../types"

export default {
  names: (clusterId: string) => (state: State) =>
    keys<string>(state.spaces[clusterId]),

  get: (clusterId: string, name: string) => (state: State) =>
    state.spaces[clusterId][name],

  raw: (state: State) => state.spaces,

  listSpacesByClusterId: (clusterId: string) => (state: State) =>
    values(state.spaces[clusterId]),

  getIngestProgress: (clusterId: string, name: string) => (state: State) => {
    let space = state.spaces[clusterId][name]
    if (space) return space.ingest_progress
  }
}
