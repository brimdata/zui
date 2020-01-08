/* @flow */

import type {Space} from "../state/spaces/types"

export default (props: $Shape<Space> = {}): Space => ({
  name: "default",
  min_time: {
    sec: 1425564900,
    ns: 0
  },
  max_time: {
    sec: 1428917793,
    ns: 750000000
  },
  packet_support: true,
  ...props
})
