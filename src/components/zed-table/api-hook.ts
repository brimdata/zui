import {getCoreRowModel, useReactTable} from "@tanstack/react-table"
import {zed} from "packages/zealot/src"
import {useEffect, useMemo, useReducer} from "react"
import {ZedTableApi} from "./api"
import {config} from "./config"
import {createColumns} from "./create-columns"
import {TableHandlers} from "./types"

type Args = {
  shape: zed.Type
  values: zed.Value[]
  handlers: TableHandlers
}

export function useApi({shape, values, handlers}: Args) {
  const [resetCounter, reset] = useReducer((s) => s + 1, 0)
  const api = useMemo(
    () => new ZedTableApi(shape, values, handlers, reset),
    [shape, values, resetCounter]
  )
  api.handlers = handlers
  api.table = useReactTable({
    columns: useMemo(() => createColumns(api, api.shape), [api]),
    data: useMemo(() => [], []),
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {size: config.defaultCellWidth},
    initialState: {
      columnSizing: handlers.getColumnWidths(shape),
    },
  })

  /**
   * In most cases, the state is given from the parent, but in the column
   * sizing case, it's easier to keep the state from the react-table instance
   * and just sync it with the parent here.
   */
  useEffect(() => {
    const widths = api.table.getState().columnSizing
    handlers.setColumnWidths(shape, widths)
  }, [api.table.getState().columnSizing])

  return api
}
