import React, {useMemo} from "react"
import {useResultsContext} from "src/app/query-home"
import {useResultsPaneContext} from "./context"
import {useTableState, useTableValues} from "./table-controller"
import {useDispatch} from "src/app/core/state"
import TableState from "src/js/state/Table"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import useSelect from "src/app/core/hooks/use-select"
import {TableView} from "src/zui-kit"

export function Table() {
  const {table, setTable} = useResultsContext()
  const ctx = useResultsPaneContext()
  const values = useTableValues()
  const state = useTableState()
  const select = useSelect()
  const initialScrollPosition = useMemo(
    () => select(TableState.getScrollPosition),
    []
  )
  const dispatch = useDispatch()
  const shape = ctx.firstShape
  return (
    <TableView
      ref={setTable}
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
      }}
    />
  )
}
