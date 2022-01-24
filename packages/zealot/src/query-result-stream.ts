import EventEmitter from "events"
import {decode, zed} from "."
import {Record} from "./zed"
import {Type} from "./zed/types/types"
import {RootRecord} from "./zjson"

type TypeDefs = {[name: string]: Type}
type Collector = (vals: {rows: zed.Value[]; shapes: TypeDefs}) => void
class Channel extends EventEmitter {
  rows: Record[] = []
  types: TypeDefs = {}
  shapes: TypeDefs = {}
  done = false
  buffer = false

  get consumed() {
    if (this.done) return Promise.resolve()
    return new Promise((resolve, reject) => {
      this.on("end", resolve)
      this.on("error", reject)
    })
  }

  addRow(row: zed.Record) {
    this.rows.push(row)
    this.emit("row", row)
  }

  addShape(name: string) {
    const shape = this.types[name]
    this.shapes[name] = shape
    this.emit("shape", shape)
  }

  hasShape(name: string) {
    return name in this.shapes
  }

  markDone() {
    this.done = true
    this.emit("end")
  }

  collect(collector: Collector) {
    this.buffer = true
    this.on("row", () => {
      collector({rows: this.rows, shapes: this.shapes})
    })
    return this.consumed
  }
}

export class QueryResultStream {
  private currentChannelId: number | undefined
  private channelsMap = new Map<number, Channel>()

  get channels() {
    return Array.from(this.channelsMap.values())
  }

  handle(json: any) {
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

  async js(): Promise<any> {
    const channel = this.channel(0)
    await channel.consumed
    return channel.rows.map((r) => r.toJS())
  }

  async zed() {
    const channel = this.channel(0)
    await channel.consumed
    return channel.rows
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

  // Forward some of the commonly used channel 0 methods
  on(name: any, fn: any) {
    // TODO Add types for the events
    return this.channel(0).on(name, fn)
  }

  consumed() {
    return Promise.all(this.channels.map((c) => c.consumed))
  }

  collect(collector: Collector) {
    return this.channel(0).collect(collector)
  }
}
