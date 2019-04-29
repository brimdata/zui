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
        body: JSON.stringify(reqOpts.payload),
        headers: basicAuthHeader(username, password),
        streaming: reqOpts.streaming
      })
    )
  }

  getAdapter() {
    return BrowserFetchAdapter
  }
}
