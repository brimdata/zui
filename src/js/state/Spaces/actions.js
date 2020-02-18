/* @flow */

import type {SPACES_DETAIL, SPACES_NAMES, Space} from "./types"

export default {
  setNames: (clusterId: string, names: string[]): SPACES_NAMES => ({
    type: "SPACES_NAMES",
    clusterId,
    names: names || []
  }),

  setDetail: (clusterId: string, space: Space): SPACES_DETAIL => ({
    type: "SPACES_DETAIL",
    clusterId,
    space
  })
}
