/* @flow */

import type {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_SET,
  SPACES_REMOVE,
  Space,
  SPACES_RENAME
} from "./types"
import type {SpaceDetailPayload} from "../../services/zealot/types"

export default {
  setSpaces: (clusterId: string, spaces: Space[]): SPACES_SET => ({
    type: "SPACES_SET",
    clusterId,
    spaces: spaces || []
  }),

  setDetail: (
    clusterId: string,
    space: $Shape<Space> | SpaceDetailPayload
  ): SPACES_DETAIL => ({
    type: "SPACES_DETAIL",
    clusterId,
    space
  }),

  rename: (
    clusterId: string,
    spaceId: string,
    newName: string
  ): SPACES_RENAME => ({
    type: "SPACES_RENAME",
    clusterId,
    spaceId,
    newName
  }),

  remove: (clusterId: string, spaceId: string): SPACES_REMOVE => ({
    type: "SPACES_REMOVE",
    clusterId,
    spaceId
  }),

  setIngestProgress: (
    clusterId: string,
    spaceId: string,
    value: number | null
  ): SPACES_INGEST_PROGRESS => ({
    type: "SPACES_INGEST_PROGRESS",
    clusterId,
    spaceId,
    value
  }),

  appendIngestWarning: (
    clusterId: string,
    spaceId: string,
    warning: string
  ): SPACES_INGEST_WARNING_APPEND => ({
    type: "SPACES_INGEST_WARNING_APPEND",
    clusterId,
    spaceId,
    warning
  }),

  clearIngestWarnings: (
    clusterId: string,
    spaceId: string
  ): SPACES_INGEST_WARNING_CLEAR => ({
    type: "SPACES_INGEST_WARNING_CLEAR",
    clusterId,
    spaceId
  })
}
