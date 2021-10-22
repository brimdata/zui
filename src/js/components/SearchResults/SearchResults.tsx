import initialViewerSearch from "app/search/flows/initial-viewer-search"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router"
import Viewer from "src/js/state/Viewer"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ResultsTable from "./ResultsTable"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useLocation()
  const status = useSelector(Viewer.getStatus)
  const viewerKey = useSelector(Viewer.getSearchKey)

  useLayoutEffect(() => {
    if (status === "INIT" || viewerKey !== location.key) {
      dispatch(initialViewerSearch())
    }
  }, [location.key])

  return (
    <div className="search-results" ref={ref}>
      <ResultsTable
        width={rect.width}
        height={rect.height}
        multiSelect={false}
      />
    </div>
  )
}
