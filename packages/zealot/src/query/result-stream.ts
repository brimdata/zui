import {decode} from "../encoder"
import {eachLine} from "../ndjson/lines"
import {RootRecord} from "../zjson"
import {Channel, Collector} from "./channel"
import {Response as NodeResponse} from "node-fetch"

type CrossResponse = Response | NodeResponse

export class ResultStream {
  private currentChannelId: number | undefined
  private channelsMap = new Map<number, Channel>()

  constructor(public resp: CrossResponse) {}

  get body() {
    return this.resp.body
  }

  get channels() {
    return Array.from(this.channelsMap.values())
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

  async js(): Promise<any> {
    this.consume()
    const channel = this.channel(0)
    await channel.consumed
    return channel.rows.map((r) => r.toJS())
  }

  async zed() {
    this.consume()
    const channel = this.channel(0)
    await channel.consumed
    return channel.rows
  }

  collect(collector: Collector) {
    this.consume()
    return this.channel(0).collect(collector)
  }

  async consume() {
    for await (let json of eachLine(this.resp.body)) this.consumeLine(json)
  }

  consumeLine(json: any) {
    switch (json.kind) {
      case "QueryChannelSet":
        this.currentChannelId = json.value.channel_id
        break
      case "Object":
        var channel = this.channel()
        var data = json.value as RootRecord
        var name = data.schema
        var row = decode(data, {typedefs: channel.types})
        if (!channel.hasShape(name)) channel.addShape(name)
        channel.addRow(row)
        break
      case "QueryChannelEnd":
        this.currentChannelId = json.value.channel_id
        this.channel().markDone()
        break
    }
  }

  consumed() {
    return Promise.all(this.channels.map((c) => c.consumed))
  }
}
