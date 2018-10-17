/* @flow */

export type Space = {
  name: string,
  flush_timeout: number,
  close_timeout: number,
  slab_threshold: number,
  slab_fanout: number,
  max_writers: number,
  min_time: string,
  max_time: string,
  size: number,
  packet_support: boolean,
  minTime: string,
  maxTime: string
}
