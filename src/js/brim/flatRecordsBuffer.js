/* @flow */
import type {FieldData} from "../types/records"
import {isArray, isString} from "../lib/is"

type Col = {name: string, type: string | Descriptor}
type Descriptor = Col[]
type Value = null | string | Value[]

type NestedRecord = {
  id: number,
  type?: Descriptor,
  values: Value[]
}

export default function flatRecordBuffers() {
  let channels = mapArrays()
  let types = {}

  return {
    add(chanId: string, records: NestedRecord[]) {
      channels.append(
        chanId,
        records.map((r) => {
          if (r.type) types[r.id] = r.type
          let record = zipFields(types[r.id], r.values)
          return flattenRecord(record)
        })
      )
    },

    records(chanId: string = "0") {
      return channels.get(chanId)
    },

    empty(chanId: string = "0") {
      return this.records(chanId).length === 0
    },

    columns() {
      return Object.keys(types).reduce((all, id) => {
        all[id] = flattenType(types[id])
        return all
      }, {})
    },

    clearRecords(chanId: string = "0") {
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

function zipFields(types, values): FieldData[] {
  // $FlowFixMe
  return values.map<FieldData>((value, index) => {
    let {name, type} = types[index]
    return isString(type)
      ? {name, type, value}
      : {name, type: "record", value: zipFields(type, value)}
  })
}

function flattenType(descriptor, prefix = "") {
  return descriptor.reduce((flat, {name, type}) => {
    let cols = isArray(type)
      ? flattenType(type, `${name}.`)
      : [{name: prefix + name, type}]

    return flat.concat(cols)
  }, [])
}

function flattenRecord(record, prefix) {
  // $FlowFixMe
  return record.reduce(
    (array, field) => array.concat(flatFields(field, prefix)),
    []
  )
}

function flatFields({name, value, type}, prefix = "") {
  return type === "record"
    ? flattenRecord(value, `${name}.`)
    : [{name: prefix + name, type, value}]
}
