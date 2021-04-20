import React from "react"
import {ZedRecord} from "zealot/zed"
import TableColumns from "../../models/TableColumns"
import {RowRenderer, ViewerDimens} from "../../types"
import * as Styler from "./Styler"

type Props = {
  rowRenderer: RowRenderer
  columns: TableColumns
  dimens: ViewerDimens
  rows: number[]
  logs: ZedRecord[]
}

export default class Chunk extends React.Component<Props> {
  render() {
    const {rowRenderer, dimens, rows} = this.props
    return (
      <div className="chunk" style={Styler.chunk(dimens, rows[0], rows.length)}>
        {rows.map((index) => rowRenderer(index, dimens))}
      </div>
    )
  }
}
