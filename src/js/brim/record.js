/* @flow */
import type {$Record, RecordData} from "../types/records"
import type {Column} from "../types"
import brim from "./"

export default function record(data: RecordData): $Record {
  return {
    columns() {
      return data.map<Column>(({name, type}) => ({name, type}))
    },
    values() {
      return data.map<string>(({value}) => value)
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
