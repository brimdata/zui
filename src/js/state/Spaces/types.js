/* @flow */

import type {SpaceDetailPayload} from "../../services/zealot/types"
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
  | SPACES_INGEST_PROGRESS
  | SPACES_INGEST_WARNING_APPEND
  | SPACES_INGEST_WARNING_CLEAR
  | SPACES_REMOVE
  | SPACES_INGEST_SNAPSHOT

export type Space = {
  name: string,
  min_time: Ts,
  max_time: Ts,
  pcap_support: boolean,
  ingest: SpaceIngest
}

type SpaceIngest = {
  warnings: string[],
  progress: number | null,
  snapshot: number | null
}

export type SPACES_NAMES = {
  type: "SPACES_NAMES",
  clusterId: string,
  names: string[]
}

export type SPACES_DETAIL = {
  type: "SPACES_DETAIL",
  clusterId: string,
  space: $Shape<Space> | SpaceDetailPayload
}

export type SPACES_INGEST_PROGRESS = {
  type: "SPACES_INGEST_PROGRESS",
  clusterId: string,
  name: string,
  value: number | null
}

export type SPACES_INGEST_WARNING_APPEND = {
  type: "SPACES_INGEST_WARNING_APPEND",
  warning: string,
  name: string,
  clusterId: string
}

export type SPACES_INGEST_WARNING_CLEAR = {
  type: "SPACES_INGEST_WARNING_CLEAR",
  name: string,
  clusterId: string
}

export type SPACES_REMOVE = {
  type: "SPACES_REMOVE",
  clusterId: string,
  name: string
}
export type SPACES_INGEST_SNAPSHOT = {
  type: "SPACES_INGEST_SNAPSHOT",
  clusterId: string,
  name: string,
  count: number
}
