/* @flow */

import type {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_SET,
  SPACES_REMOVE,
  Space
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

  remove: (clusterId: string, spaceID: string): SPACES_REMOVE => ({
    type: "SPACES_REMOVE",
    clusterId,
    spaceID
  }),

  setIngestProgress: (
    clusterId: string,
    spaceID: string,
    value: number | null
  ): SPACES_INGEST_PROGRESS => ({
    type: "SPACES_INGEST_PROGRESS",
    clusterId,
    spaceID,
    value
  }),

  appendIngestWarning: (
    clusterId: string,
    spaceID: string,
    warning: string
  ): SPACES_INGEST_WARNING_APPEND => ({
    type: "SPACES_INGEST_WARNING_APPEND",
    clusterId,
    spaceID,
    warning
  }),

  clearIngestWarnings: (
    clusterId: string,
    spaceID: string
  ): SPACES_INGEST_WARNING_CLEAR => ({
    type: "SPACES_INGEST_WARNING_CLEAR",
    clusterId,
    spaceID
  })
}
