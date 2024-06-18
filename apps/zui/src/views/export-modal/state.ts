import {useState} from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {RESULTS_QUERY_COUNT} from "../results-pane/config"

export function useExportModalState() {
  const countStatus = useSelector(Results.getStatus(RESULTS_QUERY_COUNT))
  const count = useSelector(Results.getValues(RESULTS_QUERY_COUNT))[0]?.toJS()
  const [isCopying, setIsCopying] = useState(false)

  return {
    isCopying,
    setIsCopying,
    count,
    countStatus,
  }
}
