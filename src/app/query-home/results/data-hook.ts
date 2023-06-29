import {useDeferredValue} from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"

export function useResultsData() {
  const values = useSelector(Results.getValues(RESULTS_QUERY))
  const shapes = useSelector(Results.getShapes(RESULTS_QUERY))

  return {
    values: useDeferredValue(values),
    shapes: useDeferredValue(shapes),
  }
}
