import useSearchParams from "app/router/hooks/use-search-params"
import {viewerSearch} from "app/search/flows/viewer-search"
import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router"
import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {addHeadProc} from "src/js/lib/Program"
import Current from "src/js/state/Current"
import {useResizeObserver} from "../hooks/useResizeObserver"
import {XResultsTable} from "./ResultsTable"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useLocation()
  const space = useSelector(Current.mustGetSpace)
  const {program, spanArgs, pins} = useSearchParams()
  const brimProgram = brim.program(program, pins)

  useLayoutEffect(() => {
    const [from, to] = brim
      .span(mergeDefaultSpanArgs(spanArgs, space))
      .toDateTuple()
    const perPage = brimProgram.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
    const query = addHeadProc(brimProgram.string(), perPage)
    dispatch(viewerSearch({query, from, to}))
  }, [location])

  return (
    <div className="search-results" ref={ref}>
      <XResultsTable
        width={rect.width}
        height={rect.height}
        multiSelect={false}
      />
    </div>
  )
}
