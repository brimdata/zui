import {Inspector} from "app/features/inspector/inspector"
import initialViewerSearch from "app/search/flows/initial-viewer-search"
import React, {useLayoutEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Viewer from "src/js/state/Viewer"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ResultsTable from "./ResultsTable"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)
  const status = useSelector(Viewer.getStatus)
  const viewerKey = useSelector(Viewer.getSearchKey)
  const values = useSelector(Viewer.getLogs)

  useLayoutEffect(() => {
    if (status === "INIT" || viewerKey !== location.key) {
      dispatch(initialViewerSearch())
    }
  }, [location.key])

  const [view] = useState("inspector")
  return (
    <div className="search-results" ref={ref}>
      {view === "inspector" ? (
        <Inspector height={rect.height} width={rect.width} values={values} />
      ) : (
        <ResultsTable
          width={rect.width}
          height={rect.height}
          multiSelect={false}
        />
      )}
    </div>
  )
}
