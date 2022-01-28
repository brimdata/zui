import {EventSourcePolyfill} from "event-source-polyfill"
import nodeFetch from "node-fetch"
import {PoolConfig, PoolStats} from ".."
import {decode} from "../encoder"
import {ResultStream} from "../query/result-stream"
import {parseContentType} from "../util/content-type"
import {createError} from "../util/error"
import {
  ClientOpts,
  CreatePoolOpts,
  CreatePoolResp,
  CrossFetch,
  LoadOpts,
  Pool,
  QueryOpts,
  ResponseFormat
} from "./types"

export class Client {
  public fetch: CrossFetch

  constructor(public baseURL: string, opts: Partial<ClientOpts> = {}) {
    const defaults: ClientOpts = {env: getEnv()}
    const options: ClientOpts = {...defaults, ...opts}
    this.fetch = options.env === "node" ? nodeFetch : window.fetch.bind(window)
  }

  async version() {
    const resp = await this.fetch(this.baseURL + "/version")
    const content = await parseContentType(resp)
    return resp.ok ? content : Promise.reject(createError(content))
  }

  async authMethod() {
    // TODO
    return Promise.resolve({} as any)
  }

  async query(query: string, opts: Partial<QueryOpts> = {}) {
    const defaults: QueryOpts = {format: "zjson", controlMessages: true}
    const options: QueryOpts = {...defaults, ...opts}
    const resp = await this.fetch(this.baseURL + "/query", {
      method: "POST",
      body: JSON.stringify({query}),
      headers: {
        Accept: getAcceptValue(options.format),
        "Content-Type": "application/json"
      },
      signal: options.signal
    })

    if (!resp.ok) {
      const content = await parseContentType(resp)
      return Promise.reject(createError(content))
    } else {
      return new ResultStream(resp)
    }
  }

  curl(query: string, opts: Partial<QueryOpts> = {}) {
    const defaults: QueryOpts = {format: "zjson", controlMessages: true}
    const options: QueryOpts = {...defaults, ...opts}
    return `curl -X POST -d '${JSON.stringify({query})}' \\
  -H "Accept: ${getAcceptValue(options.format)}" \\
  -H "Content-Type: application/json" \\
  ${this.baseURL}/query`
  }

  async createPool(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const defaults: CreatePoolOpts = {
      order: "desc",
      key: "ts"
    }
    const options: CreatePoolOpts = {...defaults, ...opts}
    const resp = await this.fetch(this.baseURL + "/pool", {
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

  async deletePool(poolId: string) {
    const resp = await this.fetch(this.baseURL + `/pool/${poolId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: getAcceptValue("zjson")
      }
    })
    const content = await parseContentType(resp)
    if (resp.ok) {
      return
    } else {
      return Promise.reject(createError(content))
    }
  }

  async getPools(): Promise<Pool[]> {
    const resp = await this.query("from :pools")
    return resp.js()
  }

  async getPool(nameOrId: string): Promise<PoolConfig> {
    const res = await this.query(
      `from :pools | id == ${nameOrId} or name == "${nameOrId}"`
    )

    const values = await res.js()
    if (!values || values.length == 0) throw new Error("pool not found")
    return values[0]
  }

  async getPoolStats(poolId: string): Promise<PoolStats> {
    const resp = await this.fetch(this.baseURL + `/pool/${poolId}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: getAcceptValue("zjson")
      }
    })
    const content = await parseContentType(resp)
    if (resp.ok && content !== null) {
      return decode(content, {as: "js"}) as PoolStats
    } else {
      return Promise.reject(createError(content))
    }
  }

  async updatePool(poolId: string, args: Partial<Pool>) {
    const resp = await this.fetch(this.baseURL + `/pool/${poolId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: getAcceptValue("zjson")
      },
      body: JSON.stringify(args)
    })
    const content = await parseContentType(resp)
    if (resp.ok) {
      return null
    } else {
      return Promise.reject(createError(content))
    }
  }

  async load(
    data: string | NodeJS.ReadableStream,
    opts: Partial<LoadOpts> = {}
  ) {
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
      throw createError(content)
    }
  }

  subscribe(): EventSource {
    return new EventSourcePolyfill(this.baseURL + "/events", {
      headers: {
        Accept: "application/json"
      }
    })
  }
}

function getAcceptValue(format: ResponseFormat) {
  const formats = {
    zng: "application/x-zng",
    ndjson: "application/x-ndjson",
    csv: "text/csv",
    json: "application/json",
    zjson: "application/x-zjson",
    zson: "application/x-zson"
  }
  const value = formats[format]
  if (!value) {
    throw Error(`Unknown Format: ${format}`)
  } else {
    return value
  }
}

const getEnv = () => ("fetch" in globalThis ? "web" : "node")
