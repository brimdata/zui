/* @flow */

import {keys} from "lodash"

import type {Space} from "./types"
import type {State} from "../types"

export default {
  names: (clusterId: string) => (state: State) =>
    keys<string>(state.spaces[clusterId]),

  get: (clusterId: string, name: string) => (state: State) =>
    state.spaces[clusterId][name],

  raw: (state: State) => state.spaces,

  getSpaces: (clusterId: string) => (state: State): Space[] => {
    return Object.entries(state.spaces[clusterId]).map(([name, info]) => {
      return {name, ...info}
    })
  },

  getIngestProgress: (clusterId: string, name: string) => (state: State) => {
    let space = state.spaces[clusterId][name]
    if (space) return space.ingest_progress
  }
}
