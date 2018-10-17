/* @flow */

import type {EpochObj} from "./Time"

export type Space = {
  name: string,
  flush_timeout: number,
  close_timeout: number,
  slab_threshold: number,
  slab_fanout: number,
  max_writers: number,
  min_time: EpochObj,
  max_time: EpochObj,
  size: number,
  packet_support: boolean,
  minTime: string,
  maxTime: string,
  compression: string,
  path: string
}
