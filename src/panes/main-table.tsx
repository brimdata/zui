import React from "react"
import {useResultsData} from "src/app/query-home/results/data-hook"
import {zed} from "@brimdata/zealot"
import {ZedTable} from "src/components/zed-table"

export function MainTable(props: {width: number; height: number}) {
  const {shapes, values} = useResultsData()
  const shapesArray = Object.values(shapes)
  if (shapesArray.length > 1) return <p>More than one type</p>
  const shape = shapesArray[0]
  if (!(shape instanceof zed.TypeRecord || shape instanceof zed.TypeArray)) {
    return <p>Not a Record Type</p>
  } else {
    return <ZedTable shape={shape} values={values} {...props} />
  }
}
