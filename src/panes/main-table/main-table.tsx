import React from "react"
import {useResultsData} from "src/app/query-home/results/data-hook"
import {zed} from "@brimdata/zealot"
import {ZedTable} from "src/components/zed-table"
import {MultiShapeError} from "./multi-shape-error"
import {TableHandlers} from "src/components/zed-table/types"
import {useSelector} from "react-redux"
import Table from "src/js/state/Table"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import useSelect from "src/app/core/hooks/use-select"
import Results from "src/js/state/Results"
import {useDispatch} from "src/app/core/state"
import {MAIN_RESULTS} from "src/js/state/Results/types"

function useZedTableHandlers(): TableHandlers {
  const state = useSelector(Table.getState)
  const dispatch = useDispatch()
  const select = useSelect()

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
      headerContextMenu
        .build(this, column)
        .showUnder(e.currentTarget as HTMLElement)
    },

    loadNextPage() {
      if (select(Results.isFetching(MAIN_RESULTS))) return
      if (select(Results.isComplete(MAIN_RESULTS))) return
      if (select(Results.isLimited(MAIN_RESULTS))) return
      dispatch(Results.fetchNextPage())
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
