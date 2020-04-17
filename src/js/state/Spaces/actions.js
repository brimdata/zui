/* @flow */

import type {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_NAMES
} from "./types"
import type {SpaceDetailPayload} from "../../services/zealot/types"

export default {
  setNames: (clusterId: string, names: string[]): SPACES_NAMES => ({
    type: "SPACES_NAMES",
    clusterId,
    names: names || []
  }),

  setDetail: (clusterId: string, space: SpaceDetailPayload): SPACES_DETAIL => ({
    type: "SPACES_DETAIL",
    clusterId,
    space
  }),

  setIngestProgress: (
    clusterId: string,
    space: string,
    value: number | null
  ): SPACES_INGEST_PROGRESS => ({
    type: "SPACES_INGEST_PROGRESS",
    clusterId,
    space,
    value
  }),

  appendIngestWarning: (
    clusterId: string,
    space: string,
    warning: string
  ): SPACES_INGEST_WARNING_APPEND => ({
    type: "SPACES_INGEST_WARNING_APPEND",
    clusterId,
    space,
    warning
  }),

  clearIngestWarnings: (
    clusterId: string,
    space: string
  ): SPACES_INGEST_WARNING_CLEAR => ({
    type: "SPACES_INGEST_WARNING_CLEAR",
    clusterId,
    space
  })
}
