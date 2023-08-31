import {useMemo} from "react"
import {ZedTableHandlers, ZedTableState} from "src/components/zed-table/types"
import {useDispatch} from "src/app/core/state"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"
import {useResultsContext} from "src/app/query-home"
import {headerContextMenu} from "src/app/menus/header-context-menu"
import {useSelector} from "react-redux"
import TableState from "src/js/state/Table"
import {State} from "src/js/state/types"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import {useResultsPaneContext} from "./context"
import {useNextPage} from "src/core/query/use-query"

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
  const dispatch = useDispatch()
  const shape = ctx.firstShape
  const nextPage = useNextPage(RESULTS_QUERY)
  return useMemo<ZedTableHandlers>(
    () => ({
      onStateChange: (state) => {
        dispatch(TableState.setStateForShape({shape, state}))
      },
      onScrollNearBottom: nextPage,
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
