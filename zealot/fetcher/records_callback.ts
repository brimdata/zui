import {ZealotContext, zed} from "zealot"
import * as zqd from "../zqd"

export interface RecordsCallbackArgs {
  channel: number
  typedefs: object
  newRows: zed.Record[]
  rows: zed.Record[]
}

type ChannelMap = Map<number, Channel>
type Channel = {rows: zed.Record[]; typedefs: object}
type RecordsCallback = (args: RecordsCallbackArgs) => void
type PayloadCallback = (payload: zqd.SearchRecords) => void

function getChannel(id: number, channels: ChannelMap): Channel {
  if (!channels.has(id)) {
    channels.set(id, {
      rows: [],
      typedefs: {}
    } as Channel)
  }
  return channels.get(id) as Channel
}

export function createRecordsCallback(cb: RecordsCallback): PayloadCallback {
  let channels = new Map<number, any>()

  return ({channel_id: id, records}: zqd.SearchRecords) => {
    const prev = getChannel(id, channels)
    const next = ZealotContext.decode(records, prev.typedefs)
    const chan = {
      rows: [...prev.rows, ...next],
      typedefs: prev.typedefs
    }
    channels.set(id, chan)

    cb({
      channel: id,
      newRows: next,
      rows: chan.rows,
      typedefs: chan.typedefs
    })
  }
}
