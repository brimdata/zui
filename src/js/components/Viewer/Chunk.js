/* @flow */
import React from "react"
import Chunker from "./Chunker"
import type {Layout} from "./Layout"
import type {OnRowsRendered, RowRenderer} from "./types"

type Props = {
  onRowsRendered: OnRowsRendered,
  rowRenderer: RowRenderer,
  chunker: Chunker,
  isScrolling: boolean,
  chunk: number,
  layout: Layout
}

export default class Chunk extends React.PureComponent<Props> {
  componentDidMount() {
    this.onRendered()
  }

  componentDidUpdate() {
    this.onRendered()
  }

  onRendered() {
    const rows = this.getRows()
    this.props.onRowsRendered(rows[rows.length - 1])
  }

  getRows() {
    return this.props.chunker.rows(this.props.chunk)
  }

  render() {
    const {rowRenderer, isScrolling, layout} = this.props
    return (
      <div>
        {this.getRows().map(index => rowRenderer(index, isScrolling, layout))}
      </div>
    )
  }
}
