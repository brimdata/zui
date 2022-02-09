import {isObject} from "lodash"
import {Response as NodeResponse} from "node-fetch"
import {zjson} from ".."
import {eachLine} from "../ndjson/lines"
import {JSOptions} from "../zed/values/types"
import {Channel, Collector} from "./channel"

type CrossResponse = Response | NodeResponse
export class ResultStream {
  public status: "idle" | "pending" | "error" | "aborted" | "success" = "idle"

  private currentChannelId: number | undefined
  private channelsMap = new Map<number, Channel>()
  private _promise?: Promise<void>

  constructor(public resp: CrossResponse, private ctl: AbortController) {}

  get body() {
    return this.resp.body
  }

  get promise() {
    return this.consume()
  }

  get channels() {
    return Array.from(this.channelsMap.values())
  }

  get shapes() {
    return this.channel(0).shapes
  }

  get rows() {
    return this.channel(0).rows
  }

  channel(id: number | undefined = this.currentChannelId) {
    if (id === undefined) throw new Error("Current channel not set")
    let channel = this.channelsMap.get(id)
    if (!channel) {
      channel = new Channel()
      this.channelsMap.set(id, channel)
    }
    return channel
  }

  async js(opts: JSOptions = {}): Promise<any> {
    this.consume()
    const channel = this.channel(0)
    await this.promise
    return channel.rows.map((r) => r.toJS(opts))
  }

  async zed() {
    this.consume()
    const channel = this.channel(0)
    await this.promise
    return channel.rows
  }

  collect(collector: Collector) {
    this.consume()
    this.channel(0).collect(collector)
    return this.promise
  }

  abort() {
    this.ctl.abort()
  }

  private consume() {
    if (this._promise) return this._promise

    this.status = "pending"
    // eslint-disable-next-line
    this._promise = new Promise(async (resolve, reject) => {
      try {
        for await (let json of eachLine(this.resp.body)) {
          this.consumeLine(json)
        }
        this.status = "success"
        resolve()
      } catch (e) {
        if (e instanceof DOMException && e.message.match(/user aborted/)) {
          this.status = "aborted"
          resolve()
        } else {
          this.status = "error"
          reject(e)
        }
      }
    })
    return this._promise
  }

  private consumeLine(json: zjson.QueryObject) {
    switch (json.type) {
      case "QueryChannelSet":
        this.currentChannelId = json.value.channel_id
        break
      case "QueryChannelEnd":
        this.currentChannelId = json.value.channel_id
        var channel = this.channel()
        channel.done()
        break
      case "QueryStats":
        // Do something with stats eventually
        break
      default:
        if (isObject(json.type)) {
          this.channel().consume(json)
          break
        }
        console.error("Unknown zjson object", json)
    }
  }
}
