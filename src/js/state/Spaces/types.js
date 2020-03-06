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

export type SpacesAction = SPACES_NAMES | SPACES_DETAIL | SPACES_INGEST_PROGRESS

export type Space = {
  name: string,
  min_time: Ts,
  max_time: Ts,
  packet_support: boolean,
  ingest_progress: number | null
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
