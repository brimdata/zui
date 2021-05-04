import {ZealotContext, zed} from "zealot"
import * as lake from "../lake"

type SchemaMap = {[name: string]: zed.Schema}

export interface RecordsCallbackArgs {
  channel: number
  schemas: SchemaMap
  newRows: zed.Record[]
  rows: zed.Record[]
}

type ChannelMap = Map<number, Channel>
type Channel = {rows: zed.Record[]; schemas: SchemaMap; typedefs: object}
type RecordsCallback = (args: RecordsCallbackArgs) => void
type PayloadCallback = (payload: lake.SearchRecords) => void

function getChannel(id: number, channels: ChannelMap): Channel {
  if (!channels.has(id)) {
    channels.set(id, {
      rows: [],
      schemas: {},
      typedefs: {}
    } as Channel)
  }
  return channels.get(id) as Channel
}

export function createRecordsCallback(cb: RecordsCallback): PayloadCallback {
  let channels = new Map<number, any>()

  return ({channel_id: channel, records}: lake.SearchRecords) => {
    const {typedefs, schemas, rows: prevRows} = getChannel(channel, channels)
    const newRows = records.map((zjson) => {
      const rec = ZealotContext.decodeRecord(zjson, typedefs)
      const name = zjson.schema
      const type = typedefs[name]
      schemas[name] = new zed.Schema(name, type)
      return rec
    })
    const rows = prevRows.concat(newRows)
    channels.set(channel, {rows, typedefs, schemas})

    cb({channel, rows, newRows, schemas} as RecordsCallbackArgs)
  }
}
