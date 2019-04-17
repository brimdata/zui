/* @flow */

import type {Descriptors, Tuples} from "../types"
import type {EpochObj} from "../lib/Time"

export type ClientOptions = $Shape<RequiredClientOptions>

export type RequiredClientOptions = {
  host: ?string,
  port: ?number,
  username: string,
  password: string,
  enableCache: boolean,
  enableIndex: boolean,
  timeout: number,
  searchSpan: Span,
  searchSpace: string,
  searchQueryParams: Object,
  adapter: "NodeRequest" | "BrowserFetch"
}

export type RequestOptions = {
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE",
  path: string,
  stream?: boolean,
  payload?: Object,
  query?: Object
}

export type CreateSpaceBody = {
  name: string,
  config?: {
    compression?: string,
    flush_timeout?: number,
    close_timeout?: number,
    slab_threshold?: number,
    slab_fanout?: number,
    max_writers?: number
  }
}

export type PacketArgs = {
  space: string,
  ts_sec: number,
  ts_ns: number,
  duration_sec: number,
  duration_ns: number,
  proto: string,
  src_host: string,
  src_port: string,
  dst_host: string,
  dst_port: string,
  destDir: string
}

export type Span = [Date, Date]
export type FetchAdapter = (RequestOptions, ClientOptions) => Promise<*>

type SearchDescriptorsPayload = {
  type: "SearchDescriptors",
  descriptors: Descriptors
}

type SearchTuplesPayload = {
  type: "SearchTuples",
  tuples: Tuples,
  channel_id: number
}

type SearchEndPayload = {
  type: "SearchEnd"
}

type SearchStatsPayload = {
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

export type BoomPayload =
  | SearchDescriptorsPayload
  | SearchTuplesPayload
  | SearchStatsPayload
  | SearchEndPayload
