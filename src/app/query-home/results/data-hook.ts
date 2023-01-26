import {useDeferredValue} from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"

export function useResultsData() {
  const values = useSelector(Results.getValues(MAIN_RESULTS))
  const shapes = useSelector(Results.getShapes(MAIN_RESULTS))

  return {
    values: useDeferredValue(values),
    shapes: useDeferredValue(shapes),
  }
}
