/* @flow */

import {keys} from "lodash"

import type {Space} from "./types"
import type {State} from "../types"

export default {
  ids: (clusterId: string) => (state: State) => {
    return keys<string>(getCluster(state, clusterId))
  },
  get: (clusterId: string, spaceId: string) => (state: State) => {
    return getCluster(state, clusterId)[spaceId]
  },
  getName: (clusterId: string, spaceId: string) => (state: State) => {
    const space = getCluster(state, clusterId)[spaceId]
    return space ? space.name : ""
  },
  raw: (state: State) => state.spaces,
  getSpaces: (clusterId: string) => (state: State): Space[] => {
    let clus = getCluster(state, clusterId)
    return Object.keys(clus).map((key) => {
      return {...clus[key]}
    })
  },
  getIngestProgress: (clusterId: string, spaceId: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceId]
    if (space) return space.ingest.progress
    else return null
  },
  getIngestWarnings: (clusterId: string, spaceId: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceId]
    if (space) return space.ingest.warnings
    else return []
  },
  getIngestSnapshot: (clusterId: string, spaceId: string) => (state: State) => {
    let cluster = getCluster(state, clusterId)
    let space = cluster[spaceId]
    if (space) return space.ingest.snapshot
  }
}

function getCluster(state, id): {[string]: Space} {
  return state.spaces[id] || {}
}
