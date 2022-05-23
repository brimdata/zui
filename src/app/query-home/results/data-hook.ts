import {useSelector} from "react-redux"
import Results from "src/js/state/Results"

export function useResultsData() {
  const values = useSelector(Results.getValues)

  return {
    values,
  }
}
