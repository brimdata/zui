/* @flow */
import React from "react"
import Chunker from "./Chunker"

type Props = {
  onRowsRendered: ({startIndex: number, stopIndex: number}) => void,
  rowRenderer: ({index: number, isScrolling: boolean}) => *,
  chunker: Chunker,
  isScrolling: boolean,
  chunk: number
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
    this.props.onRowsRendered({
      startIndex: rows[0],
      stopIndex: rows[rows.length - 1]
    })
  }

  getRows() {
    return this.props.chunker.rows(this.props.chunk)
  }

  render() {
    const {rowRenderer, isScrolling} = this.props
    return (
      <div>
        {this.getRows().map(index => rowRenderer({index, isScrolling}))}
      </div>
    )
  }
}
