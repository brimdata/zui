import React from "react"
import {zed} from "@brimdata/zealot"
import TableColumns from "src/js/models/TableColumns"
import {RowRenderer, ViewerDimens} from "src/js/types"
import * as Styler from "./styler"

type Props = {
  rowRenderer: RowRenderer
  columns: TableColumns
  dimens: ViewerDimens
  rows: number[]
  logs: zed.Record[]
}

const Chunk = (props: Props) => {
  const {rowRenderer, dimens, rows} = props
  return (
    <div className="chunk" style={Styler.chunk(dimens, rows[0], rows.length)}>
      {rows.map((index) => rowRenderer(index, dimens))}
    </div>
  )
}

export default Chunk
