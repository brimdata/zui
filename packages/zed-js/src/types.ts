import { Type } from './types/types';
import { Value } from './values/types';

export type QueryFormat = 'zjson' | 'zng' | 'ndjson' | 'csv' | 'json';

export type Order = 'desc' | 'asc';

export type Key = string[];

export interface Response<T> {
  kind: string;
  value: T;
}

export interface PoolLoadArgs {
  author: string;
  date?: number;
  body: string;
  data: NodeJS.ReadableStream;
  signal?: AbortSignal;
}

export interface PoolArgs {
  name: string;
  layout?: Layout;
}

export interface Layout {
  order: Order;
  keys: Key[];
}

export interface Ts {
  sec: number;
  ns: number;
}

export interface Span {
  ts: Date;
  dur: number;
}

export interface PoolConfig {
  name: string;
  id: string;
  layout: Layout;
  ts: Date;
}

export interface PoolStats {
  size: number;
  span: Span | null;
}

export interface BranchConfig {
  name: string;
  id: string;
  parent: string;
}

export interface BranchMeta {
  pool: PoolConfig;
  branch: BranchConfig;
}

export type TypeDefs = { [name: string]: Type };

export type Collector = (vals: { rows: Value[]; shapesMap: TypeDefs }) => void;

export type CollectOpts = { ms?: number; count?: number };
