import React, {useMemo} from "react"
import {useResultsData} from "src/app/query-home/results/data-hook"
import {zed} from "@brimdata/zealot"
import {MultiShapeError} from "./multi-shape-error"
import {ZedTableHandlers, ZedTableState} from "src/components/zed-table/types"
import useSelect from "src/app/core/hooks/use-select"
import Results from "src/js/state/Results"
import {useDispatch} from "src/app/core/state"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import {ZedTable} from "src/components/zed-table"
import {useResultsContext} from "src/app/query-home"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {useSelector} from "react-redux"
import Table from "src/js/state/Table"
import {State} from "src/js/state/types"
import {cellContextMenu} from "src/app/menus/cell-context-menu"
import {useActiveQuery} from "src/app/query-home/title-bar/context"

function useZedTableHandlers(
  shape: zed.Type
): [ZedTableState, ZedTableHandlers] {
  const select = useSelect()
  const dispatch = useDispatch()
  const tableState = useSelector((state: State) =>
    Table.getStateForShape(state, shape)
  )
  const {query} = useResultsContext()
  const state = useMemo(
    () => ({...tableState, columnSorted: query.toAst().sorts}),
    [tableState, query]
  )

  const handlers: ZedTableHandlers = useMemo(
    () => ({
      onStateChange: (state) => {
        dispatch(Table.setStateForShape({shape, state}))
      },
      onScrollNearBottom: () => {
        if (select(Results.isFetching(MAIN_RESULTS))) return
        if (select(Results.isComplete(MAIN_RESULTS))) return
        if (select(Results.isLimited(MAIN_RESULTS))) return
        dispatch(Results.fetchNextPage())
      },
      onHeaderContextMenu(e, column) {
        headerContextMenu
          .build(this, column)
          .showUnder(e.currentTarget as HTMLElement)
      },
      onValueContextMenu(e, value, field, cell) {
        e.preventDefault()
        cellContextMenu.build(value, field, cell).show()
      },
    }),
    [shape]
  )
  return [state, handlers]
}

export function MainTable() {
  const {shapes, values} = useResultsData()
  const {setTable} = useResultsContext()
  const shapesArray = Object.values(shapes)
  const shape = shapesArray[0]
  const [state, handlers] = useZedTableHandlers(shape)

  if (!shape) {
    return null
  } else if (shapesArray.length > 1) {
    return <MultiShapeError />
  } else if (
    !(shape instanceof zed.TypeRecord || shape instanceof zed.TypeArray)
  ) {
    return <p>Not a Record Type</p>
  } else {
    return (
      <ZedTable
        shape={shape}
        values={values}
        state={state}
        {...handlers}
        ref={setTable}
      />
    )
  }
}
