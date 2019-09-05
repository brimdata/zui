/* @flow */

import type {
  ClientOptions,
  RequestOptions,
  RequiredClientOptions
} from "../types"
import {basicAuthHeader} from "../lib/authHeaders"
import BoomRequest from "../lib/BoomRequest"
import * as BrowserFetchAdapter from "../adapters/BrowserFetchAdapter"
import SearchRequest from "../lib/SearchRequest"
import buildUrl from "../lib/buildUrl"
import defaultOptions from "../lib/defaultOptions"
import lookytalkVersion from "../lib/lookytalkVersion"
import normalizePayload from "../lib/normalizePayload"
import fs from "fs"
import http from "http"

export default class Base {
  options: RequiredClientOptions

  constructor(options: ClientOptions = {}) {
    this.options = defaultOptions()
    this.setOptions(options)
  }

  getOptions() {
    return this.options
  }

  setOptions(options: ClientOptions) {
    this.options = {
      ...this.options,
      ...options
    }
  }

  clientVersion() {
    return {lookytalk: lookytalkVersion()}
  }

  serverVersion() {
    return this.send({method: "GET", path: "/version"})
  }

  search(lookytalk: string, overrides: ?ClientOptions = {}): BoomRequest {
    let search = new SearchRequest(lookytalk, {...this.options, ...overrides})

    return this.send(
      {
        method: "POST",
        path: "/search",
        query: search.query(),
        payload: search.body(),
        streaming: true
      },
      search.options
    )
  }

  inspectSearch(lookytalk: string, overrides: ClientOptions = {}) {
    return new SearchRequest(lookytalk, {
      ...this.options,
      ...overrides
    }).inspect()
  }

  send(
    reqOpts: RequestOptions,
    clientOpts: ?RequiredClientOptions
  ): BoomRequest {
    let {host, port, username, password} = clientOpts || this.options
    if (!host || !port) throw new Error("host/port are missing")

    return this.getAdapter().send(
      new BoomRequest({
        method: reqOpts.method,
        url: buildUrl(host, port, reqOpts.path, reqOpts.query),
        body: normalizePayload(reqOpts.payload),
        headers: basicAuthHeader(username, password),
        streaming: reqOpts.streaming
      })
    )
  }

  getAdapter() {
    return BrowserFetchAdapter
  }

  ingest(space: string, path: string) {
    let {host, port, username, password} = this.options
    if (!host || !port) throw new Error("host/port are missing")

    let method = "POST"
    let urlPath = `/space/${space}/zeek`
    let query = {bulk: "t"}
    let url = buildUrl(host, port, urlPath, query)
    let headers = basicAuthHeader(username, password)
    let request = new BoomRequest({method, url, headers, body: null})
    // $FlowFixMe
    let req = http.request(url, {method})
    for (let key in headers) {
      req.setHeader(key, headers[key])
    }

    req.on("response", (res) => {
      res.setEncoding("utf-8")

      let body = ""
      res.on("data", (d) => (body += d))
      res.on("end", () => {
        try {
          body = JSON.parse(body)
          if (res.statusCode === 200) {
            request.emitDone(body)
          } else {
            request.emitError(body)
          }
        } catch {
          request.emitError(new Error(body))
        }
      })
    })

    req.on("error", (e) => request.emitError(e))

    let file = fs.createReadStream(path)
    file.pipe(req)

    return request
  }
}
