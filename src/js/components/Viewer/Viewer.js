import React, {PureComponent} from "react"
import Header from "./Header"
import Chunk from "./Chunk"
import * as Styler from "./Styler"

export default class Viewer extends PureComponent {
  constructor(props) {
    super(props)
    this.id = null
    this.onScroll = this.onScroll.bind(this)
    this.state = {
      scrollLeft: 0,
      chunks: props.chunker.visibleChunks(0),
      isScrolling: false
    }
  }

  componentDidUpdate() {
    this.updateChunks(this.view.scrollTop)
  }

  onScroll() {
    clearTimeout(this.id)
    this.updateChunks(this.view.scrollTop)
    this.setState({scrollLeft: this.view.scrollLeft, isScrolling: true})
    this.id = setTimeout(() => this.setState({isScrolling: false}), 150)
  }

  updateChunks(scrollTop) {
    const next = this.props.chunker.visibleChunks(scrollTop)
    const current = this.state.chunks
    if (!sameChunks(next, current)) {
      this.setState({chunks: next})
    }
  }

  render() {
    const {layout, chunker, rowRenderer, onRowsRendered} = this.props
    const {scrollLeft, chunks} = this.state
    return (
      <div className="viewer" style={Styler.viewer(layout)}>
        <Header layout={layout} scrollLeft={scrollLeft} />
        <div
          className="view"
          onScroll={this.onScroll}
          style={Styler.view(layout)}
          ref={r => (this.view = r)}
        >
          <div className="list" style={Styler.list(layout)}>
            {chunks.map(chunk => (
              <Chunk
                key={chunk}
                chunk={chunk}
                chunker={chunker}
                isScrolling={this.state.isScrolling}
                rowRenderer={rowRenderer}
                onRowsRendered={onRowsRendered}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const sameChunks = (a, b) => {
  return a[0] === b[0] && a[a.length - 1] === b[b.length - 1]
}
