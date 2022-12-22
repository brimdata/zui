import React from "react"
import {useResultsData} from "src/app/query-home/results/data-hook"
import {zed} from "@brimdata/zealot"
import {ZedTable} from "src/components/zed-table"
import {MultiShapeError} from "./multi-shape-error"
import {TableHandlers} from "src/components/zed-table/types"
import {useSelector, useDispatch} from "react-redux"
import Table from "src/js/state/Table"
import {headerContextMenu} from "src/app/menus/header-context-menu"

function useZedTableHandlers(): TableHandlers {
  const state = useSelector(Table.getState)
  const dispatch = useDispatch()
  return {
    getValuePage(valueId) {
      return state.valuePages.get(valueId) ?? 1
    },

    incValuePage(valueId) {
      dispatch(Table.incValuePage({key: valueId}))
    },

    isExpanded(valueId) {
      return !!state.expanded.get(valueId)
    },

    setExpanded(valueId, isExpanded) {
      dispatch(Table.setExpanded({key: valueId, isExpanded}))
    },

    isGrouped(shape, columnId) {
      return !!(state.columnGroups.get(shape) ?? {})[columnId]
    },

    setGrouped(shape, columnId, isGrouped) {
      dispatch(
        Table.setColumnGroups({shape: shape, groups: {[columnId]: isGrouped}})
      )
    },

    setColumnWidths(shape, widths) {
      dispatch(Table.setColumnWidths({shape, widths}))
    },

    getColumnWidths(shape) {
      return state.columnWidths.get(shape) ?? {}
    },

    onHeaderMenu(e, column) {
      headerContextMenu.build(column).showUnder(e.currentTarget as HTMLElement)
    },
  }
}

export function MainTable() {
  const {shapes, values} = useResultsData()
  const shapesArray = Object.values(shapes)
  const shape = shapesArray[0]
  const handlers = useZedTableHandlers()

  if (!shape) {
    return null
  } else if (shapesArray.length > 1) {
    return <MultiShapeError />
  } else if (
    !(shape instanceof zed.TypeRecord || shape instanceof zed.TypeArray)
  ) {
    return <p>Not a Record Type</p>
  } else {
    return <ZedTable shape={shape} values={values} handlers={handlers} />
  }
}
