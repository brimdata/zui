/* @flow */

import {keys} from "lodash"

import type {Space} from "./types"
import type {State} from "../types"

export default {
  names: (clusterId: string) => (state: State) => {
    return keys<string>(getCluster(state, clusterId))
  },
  get: (clusterId: string, spaceID: string) => (state: State) => {
    return getCluster(state, clusterId)[spaceID]
  },
  raw: (state: State) => state.spaces,
  getSpaces: (clusterId: string) => (state: State): Space[] => {
    let clus = getCluster(state, clusterId)
    return Object.keys(clus).map((key) => {
      return {id: key, ...clus[key]}
    })
  },
  getIngestProgress: (clusterId: string, spaceID: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceID]
    if (space) return space.ingest.progress
    else return null
  },
  getIngestWarnings: (clusterId: string, spaceID: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceID]
    if (space) return space.ingest.warnings
    else return []
  },
  getIngestSnapshot: (clusterId: string, spaceID: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceID]
    if (space) return space.ingest.snapshot
  }
}

function getCluster(state, id): {[string]: Space} {
  return state.spaces[id] || {}
}
