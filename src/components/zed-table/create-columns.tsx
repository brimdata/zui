import React from "react"
import {zed} from "@brimdata/zealot"
import {ZedValue} from "../zed-value"
import {createColumnHelper} from "@tanstack/react-table"
import {ZedTableApi} from "./api"

const columnHelper = createColumnHelper<zed.Value>()

function createColumnFromField(
  fieldType: zed.TypeField,
  colIndex: number,
  api: ZedTableApi
) {
  if (!fieldType) throw new Error("No Field")
  return columnHelper.accessor(
    (row: zed.Record) => row.getField(fieldType.name).value,
    {
      id: colIndex.toString(),
      header: fieldType.name,
      size: api.getColumnWidth(fieldType.name),
    }
  )
}

function createColumnFromArray(array: zed.TypeArray) {
  return columnHelper.accessor((row: zed.Array) => row, {
    id: "array",
    header: "array",
    cell: (info) => <ZedValue value={info.getValue()} />,
    size: 600,
  })
}

export function createColumns(api: ZedTableApi) {
  if (api.shape instanceof zed.TypeRecord) {
    return api.shape.fields.map((field, index) =>
      createColumnFromField(field, index, api)
    )
  } else if (api.shape instanceof zed.TypeArray) {
    return [createColumnFromArray(api.shape)]
  } else {
    throw new Error("Unsupported Type")
  }
}
