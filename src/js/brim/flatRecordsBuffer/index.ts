import {isArray} from "../../lib/is"
import channel, {$Channel} from "./channel"
import nestedRecord from "./nestedRecord"
import zngToZeekTypes from "./zngToZeekTypes"

export type RawColumn = {name: string; type: string | RawColumn[]}
export type RawValue = string | null | RawValue[]
export type RawRecord = {
  id: number
  type?: RawColumn[]
  values: RawValue[]
}

export default function flatRecordBuffers() {
  const channels = new Map<number, $Channel>()
  const types = {}

  return {
    getChannel(id: number) {
      let chan = channels.get(id)
      if (chan) {
        return chan
      } else {
        chan = channel(id)
        channels.set(id, chan)
        return chan
      }
    },

    add(id: number, records: RawRecord[]) {
      const chan = this.getChannel(id)
      const flatRecords = records.map((r) => {
        if (r.type) types[r.id] = zngToZeekTypes(r.type)
        return nestedRecord(r.values, types[r.id]).flatten()
      })
      chan.add(flatRecords)
    },

    empty(chanId = 0) {
      return this.getChannel(chanId).empty()
    },

    columns() {
      return Object.keys(types).reduce((all, id) => {
        all[id] = flattenType(types[id])
        return all
      }, {})
    },

    channels() {
      return Array.from<$Channel>(channels.values())
    },

    clearRecords(chanId = 0) {
      this.getChannel(chanId).clear()
    }
  }
}

function flattenType(descriptor, prefix = "") {
  return descriptor.reduce((flat, {name, type}) => {
    const cols = isArray(type)
      ? flattenType(type, `${prefix}${name}.`)
      : [{name: prefix + name, type}]

    return flat.concat(cols)
  }, [])
}
