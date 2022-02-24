import {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Viewer from "src/js/state/Viewer"
import initialViewerSearch from "../flows/initial-viewer-search"

export function useResultsData() {
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

  return {
    values
  }
}
