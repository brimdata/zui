import React from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"

export function TypeCount() {
  const shapes = useSelector(Results.getShapes(RESULTS_QUERY))
  const status = useSelector(Results.getStatus(RESULTS_QUERY))
  if (["COMPLETE", "LIMIT", "INCOMPLETE"].includes(status)) {
    return <span aria-label="shapes">Shapes: {Object.keys(shapes).length}</span>
  } else {
    return null
  }
}
