import {ZedRecord} from "zealot/zed"
import {decode, TypeContext} from "zealot/zed/zjson"
import * as zqd from "../zqd"

export interface RecordsCallbackArgs {
  channel: number
  schemas: TypeContext
  context: TypeContext
  newRows: ZedRecord[]
  rows: ZedRecord[]
}

type ChannelMap = Map<number, Channel>
type Channel = {rows: ZedRecord[]; schemas: TypeContext; context: TypeContext}
type RecordsCallback = (args: RecordsCallbackArgs) => void
type PayloadCallback = (payload: zqd.SearchRecords) => void

function getChannel(id: number, channels: ChannelMap): Channel {
  if (!channels.has(id)) {
    channels.set(id, {
      rows: [],
      schemas: {},
      context: {}
    } as Channel)
  }
  return channels.get(id) as Channel
}

export function createRecordsCallback(cb: RecordsCallback): PayloadCallback {
  let channels = new Map<number, any>()

  return ({channel_id: id, records}: zqd.SearchRecords) => {
    const prev = getChannel(id, channels)
    const next = decode(records, prev.context, prev.schemas)
    const chan = {
      rows: [...prev.rows, ...next.rows],
      schemas: next.schemas,
      context: next.context
    }
    channels.set(id, chan)
    cb({
      channel: id,
      schemas: chan.schemas,
      context: chan.context,
      newRows: next.rows,
      rows: chan.rows
    })
  }
}
