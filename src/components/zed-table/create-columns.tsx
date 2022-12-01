import React from "react"
import {zed} from "@brimdata/zealot"
import {Column} from "react-table"
import {ZedValue} from "../zed-value"

function createColumnFromField(field: zed.TypeField): Column {
  if (!field) throw new Error("No Field")
  return {
    Header: field.name,
    Cell: ({value: field}) => <ZedValue value={field.data} />,
    id: field.name,
    accessor: (record: zed.Record) => record.getField(field.name),
  }
}

function createColumnFromArray(array: zed.TypeArray): Column {
  return {
    Header: "<Array>",
    Cell: ({value}) => <ZedValue value={value} />,
    id: "Array",
    accessor: (array: zed.Array) => array,
    width: 600,
  }
}

export function createColumns(shape: zed.Type): Column[] {
  if (shape instanceof zed.TypeRecord) {
    return shape.fields.map(createColumnFromField)
  } else if (shape instanceof zed.TypeArray) {
    return [createColumnFromArray(shape)]
  } else {
    throw new Error("Unsupported Type")
  }
}
