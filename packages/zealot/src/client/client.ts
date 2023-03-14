import {EventSourcePolyfill} from "event-source-polyfill"
import {PoolConfig, PoolStats} from "../types"
import {ResultStream} from "../query/result-stream"
import {createError} from "../util/error"
import * as Types from "./types"
import {
  accept,
  defaults,
  getLoadContentType,
  json,
  parseContent,
  toJS,
  wrapAbort,
} from "./utils"

export class Client {
  static fetch: Types.WebFetch
  public auth: string | null
  public timeout = 60_000

  constructor(public baseURL: string, opts: Partial<Types.ClientOpts> = {}) {
    const defaults: Types.ClientOpts = {auth: null}
    const options: Types.ClientOpts = {...defaults, ...opts}
    this.auth = options.auth || null
  }

  async version() {
    const r = await this.send({
      method: "GET",
      path: "/version",
    })
    return await r.json()
  }

  async authMethod() {
    const r = await this.send({
      method: "GET",
      path: "/auth/method",
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
    let headers: Record<string, string> = {}
    if (opts.message) headers["Zed-Commit"] = json(opts.message)
    const res = await this.send({
      path: `/pool/${poolId}/branch/${encodeURIComponent(branch)}`,
      method: "POST",
      body: data,
      headers,
      contentType: getLoadContentType(opts.format) ?? "",
      signal: opts.signal,
      timeout: Infinity,
    })
    return toJS(res)
  }

  async query(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: "zjson",
      controlMessages: true,
    })
    const abortCtl = wrapAbort(options.signal)
    const result = await this.send({
      method: "POST",
      path: `/query?ctrl=${options.controlMessages}`,
      body: json({query}),
      contentType: "application/json",
      format: options.format,
      signal: abortCtl.signal,
      timeout: options.timeout,
    })
    return new ResultStream(result, abortCtl)
  }

  async createPool(name: string, opts: Partial<Types.CreatePoolOpts> = {}) {
    const options = defaults<Types.CreatePoolOpts>(opts, {
      order: "desc",
      key: "ts",
    })
    // @ts-ignore
    const keys = [[].concat(options.key)]
    const layout = {order: options.order, keys}
    return this.send({
      method: "POST",
      path: "/pool",
      body: json({name, layout}),
      contentType: "application/json",
    }).then(toJS)
  }

  async deletePool(poolId: string) {
    await this.send({
      method: "DELETE",
      path: `/pool/${poolId}`,
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
      path: `/pool/${poolId}/stats`,
    })
    return toJS(res)
  }

  async updatePool(poolId: string, args: Partial<Types.Pool>) {
    await this.send({
      method: "PUT",
      path: `/pool/${poolId}`,
      body: json(args),
      contentType: "application/json",
    })
    return true
  }

  subscribe(): EventSource {
    return new EventSourcePolyfill(this.baseURL + "/events", {
      headers: {Accept: "application/json"},
    })
  }

  curl(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: "zjson",
      controlMessages: true,
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
    headers?: Record<string, string>
    timeout?: number
    contentType?: string
  }) {
    const abortCtl = wrapAbort(opts.signal)
    const clearTimer = this.setTimeout(() => {
      console.error("request timed out:", opts)
      abortCtl.abort()
    }, opts.timeout)
    const headers = {...opts.headers}
    headers["Accept"] = accept(opts.format || "zjson")
    if (opts.contentType !== undefined) {
      headers["Content-Type"] = opts.contentType
    }
    if (this.auth) {
      headers["Authorization"] = `Bearer ${this.auth}`
    }
    const resp = await Client.fetch(this.baseURL + opts.path, {
      method: opts.method,
      signal: abortCtl.signal as any,
      headers: headers,
      // @ts-ignore
      body: opts.body,
    })
    clearTimer()
    if (resp.ok) {
      return resp
    } else {
      return Promise.reject(createError(await parseContent(resp)))
    }
  }

  private setTimeout(fn: () => void, ms?: number) {
    if (ms === Infinity) return () => {}
    if (ms === undefined) ms = this.timeout
    const id = setTimeout(fn, ms)
    return () => clearTimeout(id)
  }
}
