import {useSelector} from "react-redux"
import Viewer from "src/js/state/Viewer"

export function useResultsData() {
  const values = useSelector(Viewer.getLogs)

  return {
    values
  }
}
