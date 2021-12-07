import initialViewerSearch from "app/search/flows/initial-viewer-search"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ResultsTable from "./ResultsTable"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch: AppDispatch = useDispatch()
  const location = useSelector(Current.getLocation)
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
