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

export type Space = {
  name: string,
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean,
  ingest_progress: number | null,
  ingest_warnings: string[]
}

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

export type SPACES_INGEST_PROGRESS = {
  type: "SPACES_INGEST_PROGRESS",
  clusterId: string,
  space: string,
  value: number | null
}

export type SPACES_INGEST_WARNING_APPEND = {
  type: "SPACES_INGEST_WARNING_APPEND",
  warning: string,
  space: string,
  clusterId: string
}

export type SPACES_INGEST_WARNING_CLEAR = {
  type: "SPACES_INGEST_WARNING_CLEAR",
  space: string,
  clusterId: string
}
