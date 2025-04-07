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
  | 'bsup'
  | 'csup'
  | 'csv'
  | 'json'
  | 'ndjson'
  | 'parquet'
  | 'sup'
  | 'tsv'
  | 'zeek'
  | 'zjson';

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
  | 'bsup'
  | 'csup'
  | 'csv'
  | 'json'
  | 'line'
  | 'parquet'
  | 'tsv'
  | 'sup'
  | 'zeek'
  | 'zjson';

export type LoadContentType =
  | '*/*'
  | 'application/json'
  | 'application/vnd.apache.arrow.stream'
  | 'application/x-bsup'
  | 'application/x-csup'
  | 'application/x-line'
  | 'application/x-parquet'
  | 'application/x-sup'
  | 'application/x-zeek'
  | 'application/x-zjson'
  | 'text/csv'
  | 'text/tab-separated-values';

export type IsoResponse = Response;
export type IsoFetch = typeof fetch;
export type IsoAbortSignal = AbortSignal;
export type IsoBody = string | BodyInit;
