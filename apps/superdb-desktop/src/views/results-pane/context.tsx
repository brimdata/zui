import React, {ReactNode, useContext, useMemo} from "react"
import {useSelector} from "react-redux"
import {useNextPage} from "src/core/query/use-query"
import {useResults} from "src/core/query/use-results"
import Layout from "src/js/state/Layout"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/views/results-pane/config"
import {useDataTransition} from "src/util/hooks/use-data-transition"
import useResizeObserver from "use-resize-observer"
import QueryInfo from "src/js/state/QueryInfo"
import * as zed from "../../../../../packages/superdb-types/dist"

function useContextValue(parentRef: React.RefObject<HTMLDivElement>) {
  const rect = useResizeObserver({ref: parentRef})
  const nextPage = useNextPage(RESULTS_QUERY)
  const fetching = useSelector(Results.isFetching(RESULTS_QUERY))
  const r = useResults(RESULTS_QUERY)
  const results = useDataTransition(r, r.data.length === 0 && fetching)
  const shapes = useMemo(() => Object.values(results.shapes), [results.shapes])
  const parseError = useSelector(QueryInfo.getParseError)
  return {
    width: rect.width ?? 1000,
    height: rect.height ?? 1000,
    view: useSelector(Layout.getResultsView),
    error: parseError || results.error,
    values: results.data,
    shapes,
    isSingleRecordShape:
      shapes.length === 1 && zed.typeunder(shapes[0]) instanceof zed.TypeRecord,
    firstShape: shapes[0],
    loadMore: nextPage,
    key: useSelector(Results.getKey(RESULTS_QUERY)),
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
