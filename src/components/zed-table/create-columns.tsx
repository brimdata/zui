import React from "react"
import {zed} from "@brimdata/zealot"
import {ZedValue} from "../zed-value"
import {createColumnHelper} from "@tanstack/react-table"
import {useLocationState} from "src/js/components/hooks/use-location-state"

const columnHelper = createColumnHelper<zed.Value>()

function createColumnFromField(
  field: zed.TypeField,
  widths: Record<string, number>
) {
  if (!field) throw new Error("No Field")
  return columnHelper.accessor((row: zed.Record) => row.getField(field.name), {
    id: field.name, // Make this field.id
    header: field.name,
    cell: (info) => <ZedValue value={info.getValue().data} />,
    size: widths[field.name /* Make this field.id */],
  })
}

function createColumnFromArray(array: zed.TypeArray) {
  return columnHelper.accessor((row: zed.Array) => row, {
    id: "array",
    header: "array",
    cell: (info) => <ZedValue value={info.getValue()} />,
    size: 600,
  })
}

export function createColumns(shape: zed.Type, widths: Record<string, number>) {
  if (shape instanceof zed.TypeRecord) {
    return shape.fields.map((f) => createColumnFromField(f, widths))
  } else if (shape instanceof zed.TypeArray) {
    return [createColumnFromArray(shape)]
  } else {
    throw new Error("Unsupported Type")
  }
}
