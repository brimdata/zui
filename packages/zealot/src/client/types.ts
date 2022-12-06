import nodeFetch from "node-fetch"

export type ClientOpts = {
  env: "web" | "node"
  auth: string | null
}

export type ResponseFormat =
  | "zng"
  | "ndjson"
  | "csv"
  | "json"
  | "zjson"
  | "zson"
  | "zeek"

export type QueryOpts = {
  format: ResponseFormat
  controlMessages: boolean
  signal?: AbortSignal
}

export type CreatePoolOpts = {
  key: string | string[]
  order: "asc" | "desc"
}

export type Pool = {
  id: string
  name: string
  threshold: bigint
  ts: Date
  layout: {
    order: "desc" | "asc"
    keys: string[][]
  }
}

export type Branch = {
  ts: Date
  name: string
  commit: string
}

export type CreatePoolResp = {
  pool: Pool
  branch: Branch
}

export interface IdObj {
  id: string
}

export type LoadOpts = {
  pool: string | IdObj
  branch: string
  signal: AbortSignal
  message: {
    author: string
    body: string
  }
}

export type WebFetch = typeof window.fetch
export type NodeFetch = typeof nodeFetch
export type CrossFetch = WebFetch | NodeFetch
