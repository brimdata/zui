import initialViewerSearch from "app/search/flows/initial-viewer-search"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Viewer from "src/js/state/Viewer"
import styled from "styled-components"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ResultsTable from "./ResultsTable"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  flex: 1;
`

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)
  const status = useSelector(Viewer.getStatus)
  const viewerKey = useSelector(Viewer.getSearchKey)

  useLayoutEffect(() => {
    if (status === "INIT" || viewerKey !== location.key) {
      dispatch(initialViewerSearch())
    }
  }, [location.key])

  return (
    <BG ref={ref}>
      <ResultsTable
        width={rect.width}
        height={rect.height}
        multiSelect={false}
      />
    </BG>
  )
}
