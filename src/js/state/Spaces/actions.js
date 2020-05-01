/* @flow */

import type {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_NAMES,
  SPACES_REMOVE,
  Space
} from "./types"
import type {SpaceDetailPayload} from "../../services/zealot/types"

export default {
  setNames: (clusterId: string, names: string[]): SPACES_NAMES => ({
    type: "SPACES_NAMES",
    clusterId,
    names: names || []
  }),

  setDetail: (
    clusterId: string,
    space: $Shape<Space> | SpaceDetailPayload
  ): SPACES_DETAIL => ({
    type: "SPACES_DETAIL",
    clusterId,
    space
  }),

  remove: (clusterId: string, name: string): SPACES_REMOVE => ({
    type: "SPACES_REMOVE",
    clusterId,
    name
  }),

  setIngestProgress: (
    clusterId: string,
    name: string,
    value: number | null
  ): SPACES_INGEST_PROGRESS => ({
    type: "SPACES_INGEST_PROGRESS",
    clusterId,
    name,
    value
  }),

  appendIngestWarning: (
    clusterId: string,
    name: string,
    warning: string
  ): SPACES_INGEST_WARNING_APPEND => ({
    type: "SPACES_INGEST_WARNING_APPEND",
    clusterId,
    name,
    warning
  }),

  clearIngestWarnings: (
    clusterId: string,
    name: string
  ): SPACES_INGEST_WARNING_CLEAR => ({
    type: "SPACES_INGEST_WARNING_CLEAR",
    clusterId,
    name
  })
}
