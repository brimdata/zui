import React, {useMemo, useState} from "react"
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

function useZedTableHandlers(): [ZedTableState, ZedTableHandlers] {
  const select = useSelect()
  const dispatch = useDispatch()
  const [state, setState] = useState<ZedTableState>({})
  const handlers: ZedTableHandlers = useMemo(
    () => ({
      onStateChange: (next) => {
        setState(next)
      },
      onScrollNearBottom: () => {
        if (select(Results.isFetching(MAIN_RESULTS))) return
        if (select(Results.isComplete(MAIN_RESULTS))) return
        if (select(Results.isLimited(MAIN_RESULTS))) return
        dispatch(Results.fetchNextPage())
      },
      onHeaderMenu(e, column) {
        headerContextMenu
          .build(this, column)
          .showUnder(e.currentTarget as HTMLElement)
      },
    }),
    []
  )
  return [state, handlers]
}

export function MainTable() {
  const {shapes, values} = useResultsData()
  const {setTable} = useResultsContext()
  const shapesArray = Object.values(shapes)
  const shape = shapesArray[0]
  const [state, handlers] = useZedTableHandlers()

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
