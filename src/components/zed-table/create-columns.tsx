import React from "react"
import {zed} from "@brimdata/zealot"
import {ZedValue} from "../zed-value"
import {createColumnHelper} from "@tanstack/react-table"
import {useLocationState} from "src/js/components/hooks/use-location-state"
import {InspectContext} from "src/app/features/inspector/inspect-list"
import {createView} from "src/app/features/inspector/views/create"
import {ZedTableApi} from "./api"

const columnHelper = createColumnHelper<zed.Value>()

function createColumnFromField(
  fieldType: zed.TypeField,
  index: number,
  api: ZedTableApi
) {
  if (!fieldType) throw new Error("No Field")
  return columnHelper.accessor(
    (row: zed.Record) => {
      const field = row.getField(fieldType.name)
      const ctx = new InspectContext(api)
      const view = createView({
        ctx,
        value: field.value,
        type: field.value.type,
        field: field,
        key: null,
        last: true,
        indexPath: [0],
      })
      view.inspect()
      return view
    },
    {
      id: fieldType.name, // Make this field.id
      header: fieldType.name,
      cell: (info) => {
        const view = info.getValue()
        return (
          <>
            {view.ctx.rows.map(({indent, render}) => {
              return (
                <div
                  style={{
                    paddingLeft: 16 * indent,
                    display: "flex",
                    whiteSpace: "pre",
                    alignItems: "center",
                  }}
                >
                  {render}
                </div>
              )
            })}
          </>
        )
      },
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
