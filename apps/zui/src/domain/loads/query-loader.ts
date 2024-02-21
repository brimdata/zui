import {LoadContext} from "./load-context"
import {Loader} from "./types"

export class QueryLoader implements Loader {
  constructor(private ctx: LoadContext) {}

  when() {
    return this.ctx.files.length === 0 && !!this.ctx.query
  }

  async run() {
    this.ctx.setProgress(Infinity)
    const client = await this.ctx.createClient()
    await client
      .query(this.loadQuery, {signal: this.ctx.signal})
      .then((r) => r.js())
    this.ctx.setProgress(1)
  }

  private get loadQuery() {
    // This is the load op syntax
    // load <pool>[@<branch>] [author <author>] [message <message>] [meta <meta>]
    return [
      this.ctx.query,
      "| load",
      this.ctx.poolId + "@" + this.ctx.branch,
      "author " + JSON.stringify(this.ctx.author),
      "message " + JSON.stringify(this.ctx.body),
    ].join(" ")
  }
}

export function addLoad(query: string, poolId) {
  return query + " | load " + poolId
}
