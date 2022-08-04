import initialViewerSearch from "src/app/search/flows/initial-viewer-search"
import {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import Viewer from "src/js/state/Viewer"

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
    values,
  }
}