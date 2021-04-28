import {createZealot} from "./zealot"
import {createCallbacks} from "./fetcher/callbacks"
import {createStream} from "./fetcher/stream"
import {createFetcher} from "./fetcher/fetcher"
import * as zqd from "./zqd"

export type Zealot = ReturnType<typeof createZealot>
export type ZCallbacks = ReturnType<typeof createCallbacks>
export type ZReponse = ReturnType<typeof createStream>
export type ZFetcher = ReturnType<typeof createFetcher>
export type ZIterator = AsyncIterable<ZealotPayload>

export type ZealotPayload =
  | zqd.Payload
  | {type: "UploadProgress"; progress: number}

export type Enhancer = () => (payload: ZealotPayload) => any

export interface ZealotArgs {
  fetcher: (host: string) => ZFetcher
}

export type SearchFormat = "zjson" | "zng" | "ndjson" | "csv"

export interface SearchArgs {
  from: Date | Ts | bigint
  to: Date | Ts | bigint
  spaceId: string
  format: SearchFormat
  controlMessages: boolean
  enhancers: Enhancer[]
  signal?: AbortSignal
}

export interface SpaceStorageArgs {
  kind: "filestore" | "archivestore"
}

export interface SpaceArgs {
  name: string
  data_path?: string
  storage?: SpaceStorageArgs
}

export interface SubspaceCreateArgs {
  name: string
  logs: string[]
  spaceId: string
}

export interface LogsPostArgs {
  files: File[] | FileList
  spaceId: string
  types?: any
}

export interface LogsPostPathsArgs {
  paths: string[]
  spaceId: string
  types?: any
}

export interface Ts {
  sec: number
  ns: number
}

export interface Space {
  name: string
  id: string
  storage_kind: "archivestore" | "filestore"
  data_path: string
}
