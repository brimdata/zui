import {FieldData} from "../../types/records"
import {RawColumn, RawValue} from "./"
import {isString} from "../../lib/is"

export default function(values: RawValue[], columns: RawColumn[]) {
  const data = zip(values, columns)

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
  return values.map((value, index) => {
    const {name, type} = columns[index]

    return isString(type)
      ? {name, type, value}
      : {name, type: "record", value: zip(value, type)}
  })
}

function flattenRecord(record, prefix = ""): FieldData[] {
  return record.reduce(
    (array, field) => array.concat(flatFields(field, prefix)),
    []
  )
}

function flatFields({name, value, type}, prefix = "") {
  return type === "record"
    ? flattenRecord(value, `${prefix}${name}.`)
    : [{name: prefix + name, type, value}]
}
