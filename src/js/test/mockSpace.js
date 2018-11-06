/* @flow */

import type {Space} from "../lib/Space"

export default (props: $Shape<Space>): Space => ({
  name: "default",
  compression: "none",
  flush_timeout: 500,
  close_timeout: 5000,
  slab_threshold: 131072,
  slab_fanout: 8,
  max_writers: 150,
  min_time: {
    sec: 1425564900,
    ns: 0
  },
  max_time: {
    sec: 1428917793,
    ns: 750000000
  },
  size: 4580591172,
  packet_support: true,
  minTime: "2015-03-05 14:15:00.000",
  maxTime: "2015-04-13 09:36:33.750",
  ...props
})
