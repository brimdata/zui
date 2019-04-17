/* @flow */
import type {Descriptor, Tuple} from "./"
import type {EpochObj} from "../lib/Time"

export type SearchResult = {
  type: "SearchResult",
  channel_id?: number,
  results: {
    tuples: Tuple[],
    descriptor: Descriptor
  }
}

export type SearchEnd = {
  type: "SearchEnd"
}

export type SearchStats = {
  type: "SearchStats",
  start_time: EpochObj,
  update_time: EpochObj,
  stats: {
    bytes_matched: number,
    bytes_read: number,
    tuples_matched: number,
    tuples_read: number
  }
}

export type Payload = SearchResult | SearchEnd | SearchStats
