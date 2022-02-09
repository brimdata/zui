import {EventSourcePolyfill} from "event-source-polyfill"
import nodeFetch from "node-fetch"
import {PoolConfig, PoolStats} from ".."
import {ResultStream} from "../query/result-stream"
import {createError} from "../util/error"
import * as Types from "./types"
import {
  accept,
  defaults,
  getEnv,
  json,
  parseContent,
  toJS,
  wrapAbort
} from "./utils"

export class Client {
  public fetch: Types.CrossFetch
  public auth: string | null
  public timeout = 60_000

  constructor(public baseURL: string, opts: Partial<Types.ClientOpts> = {}) {
    const defaults: Types.ClientOpts = {env: getEnv(), auth: null}
    const options: Types.ClientOpts = {...defaults, ...opts}
    this.auth = options.auth || null
    this.fetch = options.env === "node" ? nodeFetch : window.fetch.bind(window)
  }

  async version() {
    const r = await this.send({
      method: "GET",
      path: "/version"
    })
    return await r.json()
  }

  async authMethod() {
    const r = await this.send({
      method: "GET",
      path: "/auth/method"
    })
    return toJS(r)
  }

  async load(
    data: string | NodeJS.ReadableStream,
    opts: Partial<Types.LoadOpts> = {}
  ) {
    const {pool} = opts
    if (!pool) throw new Error("Missing required option 'pool'")
    const poolId = typeof pool === "string" ? pool : pool.id
    const branch = opts.branch || "main"
    const headers = opts.message
      ? {"Zed-Commit": json(opts.message)}
      : undefined
    const res = await this.send({
      path: `/pool/${poolId}/branch/${encodeURIComponent(branch)}`,
      method: "POST",
      body: data,
      headers,
      signal: opts.signal
    })
    return toJS(res)
  }

  async query(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: "zjson",
      controlMessages: true
    })
    const abortCtl = wrapAbort(options.signal)
    const result = await this.send({
      method: "POST",
      path: "/query",
      body: json({query}),
      format: options.format,
      signal: abortCtl.signal
    })
    return new ResultStream(result, abortCtl)
  }

  async createPool(name: string, opts: Partial<Types.CreatePoolOpts> = {}) {
    const options = defaults<Types.CreatePoolOpts>(opts, {
      order: "desc",
      key: "ts"
    })
    // @ts-ignore
    const keys = [[].concat(options.key)]
    const layout = {order: options.order, keys}
    return this.send({
      method: "POST",
      path: "/pool",
      body: json({name, layout})
    }).then(toJS)
  }

  async deletePool(poolId: string) {
    await this.send({
      method: "DELETE",
      path: `/pool/${poolId}`
    })
    return true
  }

  async getPools(): Promise<Types.Pool[]> {
    const resp = await this.query("from :pools")
    return resp.js()
  }

  async getPool(nameOrId: string): Promise<PoolConfig> {
    const res = await this.query(
      `from :pools | id == ${nameOrId} or name == "${nameOrId}"`
    )
    const values = await res.js()
    if (!values || values.length == 0)
      throw new Error(`Pool Not Found: ${nameOrId}`)
    return values[0]
  }

  async getPoolStats(poolId: string): Promise<PoolStats> {
    const res = await this.send({
      method: "GET",
      path: `/pool/${poolId}/stats`
    })
    return toJS(res)
  }

  async updatePool(poolId: string, args: Partial<Types.Pool>) {
    await this.send({
      method: "PUT",
      path: `/pool/${poolId}`,
      body: json(args)
    })
    return true
  }

  subscribe(): EventSource {
    return new EventSourcePolyfill(this.baseURL + "/events", {
      headers: {Accept: "application/json"}
    })
  }

  curl(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: "zjson",
      controlMessages: true
    })
    return `curl -X POST -d '${JSON.stringify({query})}' \\
  -H "Accept: ${accept(options.format)}" \\
  -H "Content-Type: application/json" \\
  ${this.baseURL}/query`
  }

  private async send(opts: {
    method: "GET" | "POST" | "DELETE" | "PUT"
    path: string
    body?: string | NodeJS.ReadableStream
    format?: Types.ResponseFormat
    signal?: AbortSignal
    fetch?: Types.CrossFetch
    headers?: object
  }) {
    const abortCtl = wrapAbort(opts.signal)
    const tid = setTimeout(() => abortCtl.abort(), this.timeout)
    const fetch = opts.fetch || this.fetch
    const resp = await fetch(this.baseURL + opts.path, {
      method: opts.method,
      headers: {
        "Content-Type": "application/json",
        Accept: accept(opts.format || "zjson"),
        ...this.authHeader,
        ...opts.headers
      },
      // @ts-ignore
      body: opts.body,
      signal: abortCtl.signal
    })
    clearTimeout(tid)
    if (resp.ok) {
      return resp
    } else {
      return Promise.reject(createError(await parseContent(resp)))
    }
  }

  private get authHeader() {
    return this.auth ? {Authorization: `Bearer ${this.auth}`} : undefined
  }
}
