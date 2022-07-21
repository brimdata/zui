import React from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"

export function TypeCount() {
  const shapes = useSelector(Results.getShapes)
  const status = useSelector(Results.getStatus)
  if (["COMPLETE", "LIMIT", "INCOMPLETE"].includes(status)) {
    return <span>Shapes: {Object.keys(shapes).length}</span>
  } else {
    return null
  }
}
