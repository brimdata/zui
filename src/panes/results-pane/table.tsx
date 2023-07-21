import React, {useEffect, useMemo} from "react"
import {useResultsContext} from "src/app/query-home"
import {useResultsPaneContext} from "./context"
import {useTableState, useTableValues} from "./table-controller"
import {useDispatch} from "src/app/core/state"
import TableState from "src/js/state/Table"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import useSelect from "src/app/core/hooks/use-select"
import {TableView, TableViewApi} from "src/zui-kit"
import {useZuiApi} from "src/app/core/context"
import {BareStringView} from "src/app/query-home/results/bare-string-view"
import {PathView} from "src/app/query-home/results/path-view"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import * as zed from "@brimdata/zed-js"
import {AlertView} from "src/app/query-home/results/alert-view"

export function Table() {
  const {table, setTable} = useResultsContext()
  const ctx = useResultsPaneContext()
  const api = useZuiApi()
  const shape = ctx.firstShape
  const recordShape = zed.typeunder(shape) as zed.TypeRecord
  const values = useTableValues(recordShape, ctx.values)
  const state = useTableState()
  const select = useSelect()
  const initialScrollPosition = useMemo(
    () => select(TableState.getScrollPosition),
    []
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(TableState.setLastShape(shape))
    return () => {
      dispatch(TableState.setLastShape(null))
    }
  }, [shape])

  useEffect(() => {
    const pos = select(TableState.getScrollPosition)
    table?.scrollTo(pos)
  }, [ctx.key])

  return (
    <TableView
      ref={(table: TableViewApi | null) => {
        setTable(table)
        api.table = table
      }}
      shape={recordShape}
      values={values}
      width={ctx.width}
      height={ctx.height}
      initialScrollPosition={initialScrollPosition}
      state={{
        value: state,
        onChange: (state) => {
          dispatch(TableState.setStateForShape({shape, state}))
        },
      }}
      headerCellProps={{
        onContextMenu: (e, column) => {
          headerContextMenu
            .build(table, column)
            .showUnder(e.currentTarget as HTMLElement)
        },
      }}
      cellProps={{
        onContextMenu: (e, value, field, cell) => {
          e.preventDefault()
          valueContextMenu.build(value, field, cell.value).show()
        },
        onClick: (e, _value, field) => {
          e.preventDefault()
          dispatch(viewLogDetail(field.rootRecord))
        },
        onDoubleClick: (e, _value, field) => {
          e.preventDefault()
          dispatch(openLogDetailsWindow(field.rootRecord))
        },
      }}
      onScroll={(pos) => {
        dispatch(TableState.setScrollPosition(pos))
        if (table.nearBottom(30)) ctx.loadMore()
      }}
      viewConfig={{
        peekLimit: 2,
        lineLimit: 2,
        rowLimit: 300,
        rowsPerPage: 50,
        customViews: [AlertView, PathView, BareStringView],
        hideDecorators: true,
      }}
    />
  )
}
