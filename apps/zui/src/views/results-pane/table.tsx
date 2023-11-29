import React, {useState} from "react"
import {useResultsPaneContext} from "./context"
import {useDispatch} from "src/app/core/state"
import Slice from "src/js/state/Table"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import {TableView, TableViewApi} from "src/zui-kit"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import {useSelector} from "react-redux"
import {useScrollPosition} from "./table-controller"
import {AlertView} from "./alert-view"
import {BareStringView} from "./bare-string-view"
import {PathView} from "./path-view"

// 1. Don't forget to save the shape using zed.typeunder

export function Table() {
  const dispatch = useDispatch()
  const [table, setTable] = useState<TableViewApi | null>(null)
  const ctx = useResultsPaneContext()
  const settings = useSelector(Slice.getShapeSettings)
  const shape = useSelector(Slice.getShape)
  const initialScrollPosition = useScrollPosition(table)

  return (
    <TableView
      ref={setTable}
      shape={shape}
      values={ctx.values}
      width={ctx.width}
      height={ctx.height}
      initialScrollPosition={initialScrollPosition}
      valuePageState={{
        value: settings.valuePage,
        onChange: (next) => dispatch(Slice.setValuePage(next)),
      }}
      valueExpandedState={{
        value: settings.valueExpanded,
        onChange: (next) => dispatch(Slice.setValueExpanded(next)),
      }}
      columnExpandedDefaultState={{
        value: useSelector(Slice.getColumnExpandedDefault),
      }}
      columnExpandedState={{
        value: settings.columnExpanded,
        onChange: (next) => dispatch(Slice.setColumnExpanded(next)),
      }}
      columnSortedState={{
        value: settings.columnSorted,
        onChange: (next) => dispatch(Slice.setColumnSorted(next)),
      }}
      columnWidthState={{
        value: settings.columnWidth,
        onChange: (next) => dispatch(Slice.setColumnWidth(next)),
      }}
      columnVisibleState={{
        value: settings.columnVisible,
        onChange: (next) => dispatch(Slice.setColumnVisible(next)),
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
        dispatch(Slice.setScrollPosition(pos))
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
