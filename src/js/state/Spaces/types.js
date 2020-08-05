/* @flow */

import type {Ts} from "../../brim"

export type SpacesState = {
  // clusterId
  [string]: {
    // spaceId
    [string]: Space
  }
}

export type SpacesAction =
  | SPACES_SET
  | SPACES_DETAIL
  | SPACES_RENAME
  | SPACES_INGEST_PROGRESS
  | SPACES_INGEST_WARNING_APPEND
  | SPACES_INGEST_WARNING_CLEAR
  | SPACES_REMOVE
  | SPACES_INGEST_SNAPSHOT

export type Space = {
  name: string,
  id: string,
  min_time: Ts,
  max_time: Ts,
  pcap_support: boolean,
  storage_kind: "filestore" | "archivestore",
  ingest: SpaceIngest
}

type SpaceIngest = {
  warnings: string[],
  progress: number | null,
  snapshot: number | null
}

export type SPACES_SET = {
  type: "SPACES_SET",
  clusterId: string,
  spaces: Space[]
}

export type SPACES_DETAIL = {
  type: "SPACES_DETAIL",
  clusterId: string,
  space: $Shape<Space>
}

export type SPACES_RENAME = {
  type: "SPACES_RENAME",
  clusterId: string,
  spaceId: string,
  newName: string
}

export type SPACES_INGEST_PROGRESS = {
  type: "SPACES_INGEST_PROGRESS",
  clusterId: string,
  spaceId: string,
  value: number | null
}

export type SPACES_INGEST_WARNING_APPEND = {
  type: "SPACES_INGEST_WARNING_APPEND",
  warning: string,
  spaceId: string,
  clusterId: string
}

export type SPACES_INGEST_WARNING_CLEAR = {
  type: "SPACES_INGEST_WARNING_CLEAR",
  spaceId: string,
  clusterId: string
}

export type SPACES_REMOVE = {
  type: "SPACES_REMOVE",
  clusterId: string,
  spaceId: string
}
export type SPACES_INGEST_SNAPSHOT = {
  type: "SPACES_INGEST_SNAPSHOT",
  clusterId: string,
  spaceId: string,
  count: number
}
