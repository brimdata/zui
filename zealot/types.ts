import { createZealot } from "./zealot.ts";
import { createCallbacks } from "./fetcher/callbacks.ts";
import { createStream } from "./fetcher/stream.ts";
import { createFetcher } from "./fetcher/fetcher.ts";

export type Zealot = ReturnType<typeof createZealot>;
export type ZCallbacks = ReturnType<typeof createCallbacks>;
export type ZReponse = ReturnType<typeof createStream>;
export type ZFetcher = ReturnType<typeof createFetcher>;
export type ZIterator = AsyncGenerator<Payload>;

export type Enhancer = () => (payload: Payload) => any;

export interface ZealotArgs {
  fetcher: (host: string) => ZFetcher;
}

export interface SearchArgs {
  from: Date | Ts | bigint;
  to: Date | Ts | bigint;
  spaceId: string;
  format: "zjson" | "zng";
  controlMessages: boolean;
  enhancers: Enhancer[];
  signal?: AbortSignal;
}

export interface SpaceStorageArgs {
  kind: "filestore" | "archivestore";
}

export interface SpaceArgs {
  name: string;
  data_path?: string;
  storage?: SpaceStorageArgs;
}

export interface PcapsPostArgs {
  spaceId: string;
  path: string;
}

export interface PcapsGetArgs {
  spaceId: string;
  ts_sec: number;
  ts_ns: number;
  duration_sec: number;
  duration_ns: number;
  proto: string;
  src_host: string;
  src_port: string;
  dst_host: string;
  dst_port: string;
}

export interface LogsPostArgs {
  paths: string[];
  spaceId: string;
  types?: any;
}

export interface Ts {
  sec: number;
  ns: number;
}

export interface Space {
  name: string;
  id: string;
  storage_kind: "archivestore" | "filestore";
  data_path: string;
}

export interface PcapsPostPayload {
  // More needs to be added here
  type: string;
}

export interface ZngType {
  name: string;
  type: string | ZngTypeDef;
}

export type ZngTypeDef = ZngType[];

export interface Record {
  id: number;
  values: any[];
  type?: ZngTypeDef;
}

export interface Field {
  name: string;
  type: string;
  value: string;
}

export type FlatRecord = Field[];
export type FlatType = { name: string; type: string };

export interface SearchRecordsPayload {
  type: "SearchRecords";
  records: Record[];
  flat_records: FlatRecord[];
  flat_types: { [id: number]: FlatType[] };
}

export interface SearchWarningsPayload {
  type: "SearchWarnings";
  warnings: string[];
}

export interface SearchStatsPayload {
  type: "SearchStats";
  update_time: number;
  start_time: number;
  bytes_read: number;
}

export interface TaskStartPayload {
  type: "TaskStart";
  task_id: number;
}

export interface TaskEndPayload {
  type: "TaskEnd";
  task_id: number;
  total_records: number;
}

export type Payload =
  | SearchRecordsPayload
  | TaskEndPayload;
