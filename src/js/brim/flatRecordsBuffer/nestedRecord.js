/* @flow */
import type {FieldData} from "../../types/records"
import type {RawColumn, RawValue} from "./"
import {isString} from "../../lib/is"

export default function(values: RawValue[], columns: RawColumn[]) {
  let data = zip(values, columns)

  return {
    data() {
      return data
    },
    flatten(): FieldData[] {
      return flattenRecord(data)
    }
  }
}

function zip(values, columns) {
  // $FlowFixMe
  return values.map((value, index) => {
    let {name, type} = columns[index]
    // $FlowFixMe
    return isString(type)
      ? {name, type, value}
      : {name, type: "record", value: zip(value, type)}
  })
}

function flattenRecord(record, prefix): FieldData[] {
  // $FlowFixMe
  return record.reduce(
    // $FlowFixMe
    (array, field) => array.concat(flatFields(field, prefix)),
    []
  )
}

// $FlowFixMe
function flatFields({name, value, type}, prefix = "") {
  // $FlowFixMe
  return type === "record"
    ? flattenRecord(value, `${name}.`)
    : [{name: prefix + name, type, value}]
}
