import {useMemo} from "react"
import {createRecord, zed} from "@brimdata/zealot"
import {ZedTableHandlers, ZedTableState} from "src/components/zed-table/types"
import useSelect from "src/app/core/hooks/use-select"
import Results from "src/js/state/Results"
import {useDispatch} from "src/app/core/state"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import {useResultsContext} from "src/app/query-home"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {useSelector} from "react-redux"
import TableState from "src/js/state/Table"
import {State} from "src/js/state/types"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import {useResultsPaneContext} from "./context"

export function useTableState() {
  const {firstShape} = useResultsPaneContext()
  const {query} = useResultsContext()
  const state = useSelector((state: State) =>
    TableState.getStateForShape(state, firstShape)
  )
  return useMemo<ZedTableState>(
    () => ({...state, columnSorted: query.toAst().sorts}),
    [state, query]
  )
}

export function useTableHandlers() {
  const ctx = useResultsPaneContext()
  const select = useSelect()
  const dispatch = useDispatch()
  const shape = ctx.firstShape
  return useMemo<ZedTableHandlers>(
    () => ({
      onStateChange: (state) => {
        dispatch(TableState.setStateForShape({shape, state}))
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
        valueContextMenu.build(value, field, cell.value).show()
      },
    }),
    [shape]
  )
}

export function useTableValues(shape: zed.Any, values: zed.Value[]) {
  return useMemo(() => {
    if (shape instanceof zed.TypeRecord) {
      return values
    } else {
      return values.map((value) => createRecord({this: value}))
    }
  }, [shape, values])
}
