import {decode, zed} from "@brimdata/zealot"
import * as lake from "../lake"

type SchemaMap = {[name: string]: zed.Schema}

export interface RecordCallbackRet {
  channel: number
  schemas: SchemaMap
  newRow: zed.Record
  rows: zed.Record[]
}

type ChannelMap = Map<number, Channel>
type Channel = {
  rows: zed.Record[]
  schemas: SchemaMap
  typedefs: {[key: string]: zed.Type}
}
type RecordCallback = (
  payload: lake.QueryRecordValue,
  channel: number
) => RecordCallbackRet

function getChannel(id: number, channels: ChannelMap): Channel {
  if (!channels.has(id)) {
    channels.set(id, {
      rows: [],
      schemas: {},
      typedefs: {}
    })
  }
  return channels.get(id)
}

export function createRecordCallback(): RecordCallback {
  let channels = new Map<number, Channel>()

  return (record: lake.QueryRecordValue, channel: number) => {
    const {typedefs, schemas, rows: prevRows} = getChannel(channel, channels)
    const newRow = decode(record, {typedefs})
    const name = record.schema
    const type = typedefs[name]
    schemas[name] = new zed.Schema(name, type as zed.TypeRecord)

    const rows = prevRows.concat(newRow)
    channels.set(channel, {rows, typedefs, schemas})
    return {channel, rows, newRow, schemas}
  }
}
