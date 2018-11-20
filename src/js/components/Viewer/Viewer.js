import React, {PureComponent} from "react"
import Header from "./Header"
import Chunk from "./Chunk"
import * as Styler from "./Styler"

export default class Viewer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {scrollLeft: 0, chunks: props.chunker.visibleChunks(0)}
    this.onScroll = this.onScroll.bind(this)
    console.log("chunks", this.state)
  }

  componentDidUpdate() {
    this.updateChunks(this.view.scrollTop)
  }

  onScroll() {
    this.updateChunks(this.view.scrollTop)
    this.setState({scrollLeft: this.view.scrollLeft})
  }

  updateChunks(scrollTop) {
    const next = this.props.chunker.visibleChunks(scrollTop)
    const current = this.state.chunks
    if (!sameChunks(next, current)) {
      this.setState({chunks: next})
    }
  }

  render() {
    const {layout, chunker, rowRenderer} = this.props
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
                rowRenderer={rowRenderer}
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
