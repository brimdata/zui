/* @flow */

import type {SPACES_DETAIL, SPACES_NAMES, SPACES_INGEST_PROGRESS} from "./types"
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
  })
}
