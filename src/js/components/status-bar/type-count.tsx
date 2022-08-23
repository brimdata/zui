import React from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"

export function TypeCount() {
  const shapes = useSelector(Results.getShapes(MAIN_RESULTS))
  const status = useSelector(Results.getStatus(MAIN_RESULTS))
  if (["COMPLETE", "LIMIT", "INCOMPLETE"].includes(status)) {
    return <span aria-label="shapes">Shapes: {Object.keys(shapes).length}</span>
  } else {
    return null
  }
}
