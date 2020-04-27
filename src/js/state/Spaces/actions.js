/* @flow */

import type {
  SPACES_DETAIL,
  SPACES_INGEST_PROGRESS,
  SPACES_INGEST_WARNING_APPEND,
  SPACES_INGEST_WARNING_CLEAR,
  SPACES_NAMES,
  Space
} from "./types"

export default {
  setNames: (clusterId: string, names: string[]): SPACES_NAMES => ({
    type: "SPACES_NAMES",
    clusterId,
    names: names || []
  }),

  setDetail: (clusterId: string, space: $Shape<Space>): SPACES_DETAIL => ({
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
