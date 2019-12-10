/* @flow */
import type {Descriptor} from "../types"

type Record = {
  id: number,
  type?: Descriptor,
  values: string[]
}

export default function recordCollector() {
  let channels = mapArrays()
  let types = {}

  function toFields({values, id}) {
    let col = types[id]
    return values.map((value, index) => {
      // $FlowFixMe
      let {name, type} = col[index]
      return {name, type, value}
    })
  }

  function toRows(records) {
    return records.map((r) => {
      if (r.type) types[r.id] = r.type
      return toFields(r)
    })
  }

  return {
    add(chanId: string, records: Record[]) {
      channels.append(chanId, toRows(records))
    },

    records(chanId: string = "0") {
      return channels.get(chanId)
    },

    columns() {
      return types
    },

    clear(chanId: string = "0") {
      channels.clear(chanId)
    }
  }
}

function mapArrays() {
  let m = new Map<string, *[]>()

  return {
    append(key, value) {
      let array = this.get(key)
      this.set(key, array.concat(value))
    },
    get(key) {
      return m.get(key) || []
    },
    set(key, val) {
      return m.set(key, val)
    },
    clear(key) {
      return m.set(key, [])
    }
  }
}
