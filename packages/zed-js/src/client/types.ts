export type ClientOpts = {
  auth: string | null;
};

export type RequestOpts = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
  body?: IsoBody;
  format?: ResponseFormat;
  signal?: IsoAbortSignal;
  headers?: Record<string, string>;
  timeout?: number;
  contentType?: string;
  duplex?: 'half';
};

export type ResponseFormat =
  | 'arrows'
  | 'csv'
  | 'json'
  | 'ndjson'
  | 'parquet'
  | 'tsv'
  | 'vng'
  | 'zeek'
  | 'zjson'
  | 'zng'
  | 'zson';

export type QueryOpts = {
  format: ResponseFormat;
  controlMessages: boolean;
  signal?: AbortSignal;
  timeout?: number;
};

export type CreatePoolOpts = {
  key: string | string[];
  order: 'asc' | 'desc';
};

export type Pool = {
  id: string;
  name: string;
  threshold: bigint;
  ts: Date;
  layout: {
    order: 'desc' | 'asc';
    keys: string[][];
  };
};

export type Branch = {
  ts: Date;
  name: string;
  commit: string;
};

export type CreatePoolResp = {
  pool: Pool;
  branch: Branch;
};

export interface IdObj {
  id: string;
}

export type LoadOpts = {
  pool: string | IdObj;
  branch: string;
  message: {
    author: string;
    body: string;
  };
  signal?: AbortSignal;
  format?: LoadFormat;
};

export type LoadFormat =
  | 'auto'
  | 'arrows'
  | 'csv'
  | 'json'
  | 'line'
  | 'parquet'
  | 'tsv'
  | 'csup'
  | 'zeek'
  | 'zjson'
  | 'bsup'
  | 'jsup';

export type LoadContentType =
  | '*/*'
  | 'application/vnd.apache.arrow.stream'
  | 'text/csv'
  | 'application/json'
  | 'application/x-line'
  | 'application/x-parquet'
  | 'text/tab-separated-values'
  | 'application/x-vng'
  | 'application/x-zeek'
  | 'application/x-zjson'
  | 'application/x-zng'
  | 'application/x-zson';

export type IsoResponse = Response;
export type IsoFetch = typeof fetch;
export type IsoAbortSignal = AbortSignal;
export type IsoBody = string | BodyInit;
