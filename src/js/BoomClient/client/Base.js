/* @flow */

import type {
  ClientOptions,
  RequestOptions,
  RequiredClientOptions
} from "../types"
import * as BrowserFetchAdapter from "../adapters/BrowserFetchAdapter"
import Handler from "../lib/Handler"
import * as NodeRequestAdapter from "../adapters/NodeRequestAdapter"
import SearchRequest from "../lib/SearchRequest"
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

  send(reqOpts: RequestOptions, clientOpts: ?RequiredClientOptions) {
    return this.getAdapter().send(reqOpts, clientOpts || this.options)
  }

  stream(reqOpts: RequestOptions, clientOpts: ?RequiredClientOptions) {
    return this.getAdapter().stream(reqOpts, clientOpts || this.options)
  }

  search(lookytalk: string, overrides: ?ClientOptions = {}): Handler {
    const search = new SearchRequest(lookytalk, {...this.options, ...overrides})

    return this.stream(
      {
        method: "POST",
        path: "/search",
        query: search.query(),
        payload: search.body()
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

  clientVersion() {
    return {
      lookytalk: lookytalkVersion()
    }
  }

  serverVersion() {
    return this.send({
      method: "GET",
      path: "/version"
    })
  }

  getAdapter() {
    switch (this.options.adapter) {
      case "NodeRequest":
        return NodeRequestAdapter
      case "BrowserFetch":
        return BrowserFetchAdapter
      default:
        throw new Error("Unknown HTTP Adapter")
    }
  }
}
