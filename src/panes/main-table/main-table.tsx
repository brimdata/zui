import React from "react"
import {useResultsData} from "src/app/query-home/results/data-hook"
import {zed} from "@brimdata/zealot"
import {ZedTable} from "src/components/zed-table"
import {MultiShapeError} from "./multi-shape-error"

export function MainTable(props: {width: number; height: number}) {
  const {shapes, values} = useResultsData()
  const shapesArray = Object.values(shapes)
  const shape = shapesArray[0]

  if (!shape) {
    return null
  } else if (shapesArray.length > 1) {
    return <MultiShapeError shapes={shapes} />
  } else if (
    !(shape instanceof zed.TypeRecord || shape instanceof zed.TypeArray)
  ) {
    return <p>Not a Record Type</p>
  } else {
    return <ZedTable shape={shape} values={values} {...props} />
  }
}
