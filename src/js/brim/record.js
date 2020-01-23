/* @flow */
import type {$Record, FieldValue, RecordData} from "../types/records"
import type {Column} from "../types"
import brim from "./"

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
    field(name: string) {
      let fieldData = data.find((field) => field.name === name)
      return fieldData ? brim.field(fieldData) : null
    }
  }
}
