/* @flow */

import type {
  PacketPostStatus,
  SPACES_DETAIL,
  SPACES_NAMES,
  SPACES_PACKET_POST_STATUS,
  SpaceDetailPayload
} from "./types"

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
  })
}
