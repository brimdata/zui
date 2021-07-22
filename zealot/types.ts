import {createZealot} from "./zealot"
import {createCallbacks} from "./fetcher/callbacks"
import {createStream} from "./fetcher/stream"
import {createFetcher} from "./fetcher/fetcher"
import * as lake from "./lake"

export type Zealot = ReturnType<typeof createZealot>
export type ZCallbacks = ReturnType<typeof createCallbacks>
export type ZReponse = ReturnType<typeof createStream>
export type ZFetcher = ReturnType<typeof createFetcher>
export type ZIterator = AsyncIterable<ZealotPayload>

export type ZealotPayload =
  | lake.Payload
  | {type: "UploadProgress"; progress: number}

export type Enhancer = () => (payload: ZealotPayload) => any

export interface ZealotArgs {
  fetcher: (host: string) => ZFetcher
}

export type SearchFormat = "zjson" | "zng" | "ndjson" | "csv"

export type Order = "desc" | "asc"

export type Key = string[]

export interface Response<T> {
  kind: string
  value: T
}

export interface SearchArgs {
  from: Date | Ts | bigint
  to: Date | Ts | bigint
  poolId: string
  format: SearchFormat
  controlMessages: boolean
  enhancers: Enhancer[]
  signal?: AbortSignal
}

export interface PoolAddArgs {
  data: NodeJS.ReadableStream
  signal?: AbortSignal
}

export interface PoolCommitArgs {
  message: string
  author: string
  date?: number
  signal?: AbortSignal
}

export interface PoolArgs {
  name: string
  layout?: Layout
}

export interface LogsPostArgs {
  files: File[] | FileList
  poolId: string
  types?: any
}

export interface LogsPostPathsArgs {
  paths: string[]
  poolId: string
  types?: any
}

export interface Layout {
  order: Order
  keys: Key[]
}

export interface Ts {
  sec: number
  ns: number
}

export interface Span {
  ts: bigint
  dur: bigint
}

export interface PoolConfig {
  name: string
  id: string
  layout: Layout
}

export interface PoolStats {
  size: number
  span?: Span
}
