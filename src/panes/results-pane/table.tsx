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
import {useBrimApi} from "src/app/core/context"
import {BareStringView} from "src/app/query-home/results/bare-string-view"
import {PathView} from "src/app/query-home/results/path-view"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"

export function Table() {
  const {table, setTable} = useResultsContext()
  const ctx = useResultsPaneContext()
  const api = useBrimApi()
  const values = useTableValues()
  const state = useTableState()
  const select = useSelect()
  const initialScrollPosition = useMemo(
    () => select(TableState.getScrollPosition),
    []
  )
  const dispatch = useDispatch()
  const shape = ctx.firstShape

  useEffect(() => {
    dispatch(TableState.setLastShape(shape))
    return () => {
      dispatch(TableState.setLastShape(null))
    }
  }, [shape])

  return (
    <TableView
      ref={(table: TableViewApi | null) => {
        setTable(table)
        api.table = table
      }}
      shape={shape}
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
        onDoubleClick: (e, _value, field, _cell) => {
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
        customViews: [PathView, BareStringView],
        hideDecorators: true,
      }}
    />
  )
}
