import React from "react"

export default class Chunk extends React.PureComponent {
  render() {
    const {chunker, chunk, rowRenderer, isScrolling} = this.props
    return (
      <div>
        {chunker.rows(chunk).map(index => rowRenderer({index, isScrolling}))}
      </div>
    )
  }
}
