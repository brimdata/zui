/* @flow */
import type {Column} from "../types"
import type {FieldValue, RecordData} from "../types/records"
import brim, {type $Field} from "./"

export type $Record = {|
  columns: () => Column[],
  values: () => FieldValue[],
  data: () => RecordData,
  find: (string) => ?$Field,
  get: (string) => $Field
|}

export default function record(data: RecordData): $Record {
  return {
    columns() {
      return data.map<Column>(({name, type}) => ({name, type}))
    },
    values() {
      return data.map<FieldValue>(({value}) => value)
    },
    data() {
      return data
    },
    find(name: string) {
      let fieldData = data.find((field) => field.name === name)
      return fieldData ? brim.field(fieldData) : null
    },
    get(name: string) {
      const f = this.find(name)
      if (f) return f
      else throw new Error(`Missing field: ${name}`)
    }
  }
}
