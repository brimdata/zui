import React, {useEffect, useRef} from "react"
import {zed} from "packages/zealot/src"
import {useMemo} from "react"
import {getCoreRowModel, useReactTable} from "@tanstack/react-table"
import {Provider} from "./context"
import {createColumns} from "./create-columns"
import {Grid} from "./grid"
import {config} from "./config"
import classNames from "classnames"
import {ZedTableApi} from "./api"
import {useSelector} from "react-redux"
import Table from "src/js/state/Table"
import {useDispatch} from "src/app/core/state"

/**
 * TODO LIST
 *
 * - [x] The height of the table needs to account for the fixed header
 * - [x] The header must scroll left along with the table
 * - [x] Resize columns
 * - [x] Autosize columns
 * - [x] Expand complex values
 * - [x] Use robust cell and value ids
 * - [x] Configure preview limits in the <ZedValue component />
 * - [x] Auto detect the size of the cells
 * - [x] Multi-shape design?
 * - [ ] Infinite Scroll
 * - [x] Header groups for nested records
 * - [x] Figure out an id scheme for nexted columns
 * - [ ] Keep track of which records you want to expand headers for
 * - [x] Make sure the styles are the same when you are measuring (font-family)
 * - [x] Store the columns widths per shape, since zed identities are stable
 * - [x] Re-style the header
 * - [ ] Add the right click menus
 * - [ ] Cell selection to match google docs
 * - [ ] Right click on selected cells menu
 */

export function ZedTable(props: {
  shape: zed.TypeRecord | zed.TypeArray
  values: zed.Value[]
}) {
  const {shape, values} = props
  const ref = useRef<HTMLDivElement | null>(null)
  const state = useSelector(Table.getState)
  const dispatch = useDispatch()
  const api = useMemo(() => {
    return new ZedTableApi({shape, values, state, ref, dispatch})
  }, [shape, values, ref, dispatch, state.columnGroups])
  api.state = state
  const columns = useMemo(() => createColumns(api, api.shape), [api])

  api.table = useReactTable({
    columns,
    data: useMemo(() => [], []),
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {size: config.defaultCellWidth},
    initialState: {
      columnSizing: state.columnWidths.get(shape) ?? {},
    },
  })

  // Sync column sizes
  useEffect(() => {
    const widths = api.table.getState().columnSizing
    dispatch(Table.setColumnWidths({shape, widths}))
  }, [api.table.getState().columnSizing])

  useEffect(() => {
    if (api.isResizing) {
      document.body.classList.add("no-select", "col-resize")
    } else {
      document.body.classList.remove("no-select", "col-resize")
    }
    return () => {
      document.body.classList.remove("no-select", "col-resize")
    }
  }, [api.isResizing])

  return (
    <Provider value={api}>
      <div
        className={classNames("zed-table", {
          "zed-table--resizing": api.isResizing,
        })}
        ref={ref}
      >
        <Grid />
      </div>
    </Provider>
  )
}