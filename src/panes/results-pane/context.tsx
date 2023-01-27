import React, {ReactNode, useContext, useMemo} from "react"
import {useSelector} from "react-redux"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "src/app/core/state"
import Layout from "src/js/state/Layout"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import useResizeObserver from "use-resize-observer"

function useContextValue(parentRef: React.RefObject<HTMLDivElement>) {
  const rect = useResizeObserver({ref: parentRef})
  const shapesObj = useSelector(Results.getShapes(MAIN_RESULTS))
  const shapes = useMemo(() => Object.values(shapesObj), [shapesObj])
  const select = useSelect()
  const dispatch = useDispatch()

  return {
    width: rect.width ?? 1000,
    height: rect.height ?? 1000,
    view: useSelector(Layout.getResultsView),
    error: useSelector(Results.getError(MAIN_RESULTS)),
    values: useSelector(Results.getValues(MAIN_RESULTS)),
    shapes,
    isSingleShape: shapes.length === 1,
    firstShape: shapes[0],
    loadMore: () => {
      if (select(Results.isFetching(MAIN_RESULTS))) return
      if (select(Results.isComplete(MAIN_RESULTS))) return
      if (select(Results.isLimited(MAIN_RESULTS))) return
      dispatch(Results.fetchNextPage())
    },
  }
}

type ContextValue = ReturnType<typeof useContextValue>
const Context = React.createContext<ContextValue | null>(null)

export function ResultsPaneProvider(props: {
  children: ReactNode
  parentRef: React.RefObject<HTMLDivElement>
}) {
  const value = useContextValue(props.parentRef)
  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export function useResultsPaneContext() {
  const value = useContext(Context)
  if (!value) throw Error("Provide context")
  return value
}
