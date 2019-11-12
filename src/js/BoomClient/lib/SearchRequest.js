/* @flow */

import type {ClientOptions} from "../types"
import buildUrl from "./buildUrl"
import toAst from "./toAst"
import toDur from "./toDur"
import toTs from "./toTs"

export default class SearchRequest {
  zql: string
  options: ClientOptions

  constructor(zql: string, options: ClientOptions) {
    this.zql = zql
    this.options = options
  }

  url() {
    if (!this.options.host || !this.options.port)
      throw new Error("Host and Port required")
    return buildUrl(
      this.options.host,
      this.options.port,
      "/search",
      this.query()
    )
  }

  query() {
    const query = {...this.options.searchQueryParams}

    if (!this.options.enableCache) query.rewrite = "f"
    if (!this.options.enableIndex) query.useindex = "f"

    return query
  }

  body() {
    const {searchSpan, searchSpace: space} = this.options
    const [from, to] = searchSpan
    const proc = this.ast()
    return {
      proc,
      space,
      dir: -1,
      span: {
        ts: toTs(from),
        dur: toDur([from, to])
      }
    }
  }

  ast() {
    return toAst(this.zql)
  }

  inspect() {
    return {
      method: "POST",
      url: this.url(),
      body: this.body()
    }
  }
}
