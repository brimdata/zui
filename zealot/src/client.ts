import fetch from "cross-fetch"
import nodeFetch from "node-fetch"
import {AbortSignal} from "node-fetch/externals"
import {decode} from "."
import {parseContentType} from "./fetcher/contentType"
import {eachLine} from "./ndjson/lines"
import {QueryResultStream} from "./query-result-stream"
import {createError} from "./util/error"

type ResponseFormat = "zng" | "ndjson" | "csv" | "json" | "zjson"

type QueryOpts = {
  format: ResponseFormat
  signal?: AbortSignal
}

type CreatePoolOpts = {
  key: string | string[]
  order: "asc" | "desc"
}

type Pool = {
  id: string
  name: string
  threshold: bigint
  ts: Date
  layout: {
    order: "desc" | "asc"
    keys: string[][]
  }
}

type Branch = {
  ts: Date
  name: string
  commit: string
}

type CreatePoolResp = {
  pool: Pool
  branch: Branch
}

interface IdObj {
  id: string
}

type LoadOpts = {
  pool: string | IdObj
  branch: string
  signal: AbortSignal
  message: object
}

export class Client {
  baseURL: string
  constructor(public address: string) {
    this.baseURL = `http://${address}`
  }

  async version() {
    const resp = await fetch(this.baseURL + "/version")
    const content = await parseContentType(resp)
    return resp.ok ? content : Promise.reject(createError(content))
  }

  async query(query: string, opts: Partial<QueryOpts> = {}) {
    const defaults: QueryOpts = {format: "zjson"}
    const options: QueryOpts = {...defaults, ...opts}

    const resp = await fetch(this.baseURL + "/query", {
      method: "POST",
      body: JSON.stringify({query}),
      headers: {
        Accept: getAcceptValue(options.format),
        "Content-Type": "application/json"
      },
      signal: options.signal
    })

    const stream = new QueryResultStream()
    if (!resp.ok) {
      const content = await parseContentType(resp)
      return Promise.reject(createError(content))
    } else {
      emit(resp.body, stream)
    }
    return stream
  }

  async createPool(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const defaults: CreatePoolOpts = {
      order: "desc",
      key: "ts"
    }
    const options: CreatePoolOpts = {...defaults, ...opts}
    const resp = await fetch(this.baseURL + "/pool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: getAcceptValue("zjson")
      },
      body: JSON.stringify({
        name,
        layout: {
          order: options.order,
          // @ts-ignore What's with all the array wrapping?
          keys: [[].concat(options.key)]
        }
      })
    })
    const content = await parseContentType(resp)
    if (resp.ok && content !== null) {
      return decode(content, {as: "js"}) as CreatePoolResp
    } else {
      return Promise.reject(createError(content))
    }
  }

  async load(data: string, opts: Partial<LoadOpts> = {}) {
    const {pool} = opts
    if (!pool) throw new Error("Missing required option 'pool'")
    const poolId = typeof pool === "string" ? pool : pool.id
    const branch = opts.branch || "main"
    const path = `/pool/${poolId}/branch/${encodeURIComponent(branch)}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: getAcceptValue("zjson")
    }
    if (opts.message) {
      headers["Zed-Commit"] = JSON.stringify(opts.message)
    }
    const resp = await nodeFetch(this.baseURL + path, {
      method: "POST",
      headers,
      body: data,
      signal: opts.signal
    })
    const content = await parseContentType(resp)
    if (resp.ok && content !== null) {
      return decode(content, {as: "js"})
    } else {
      Promise.reject(createError(content))
    }
  }
}

function getAcceptValue(format: ResponseFormat) {
  const formats = {
    zng: "application/x-zng",
    ndjson: "application/x-ndjson",
    csv: "text/csv",
    json: "application/json",
    zjson: "application/x-zjson"
  }
  const value = formats[format]
  if (!value) {
    throw Error(`Unknown Format: ${format}`)
  } else {
    return value
  }
}

async function emit(
  readable: ReadableStream | null,
  stream: QueryResultStream
) {
  for await (let json of eachLine(readable)) {
    stream.handle(json)
  }
}
