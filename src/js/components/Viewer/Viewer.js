/* @flow */

import React, {PureComponent} from "react"
import Header from "./Header"
import Chunk from "./Chunk"
import * as Styler from "./Styler"
import Chunker from "./Chunker"
import type {Layout} from "./Layout"
import type {RowRenderer} from "./types"

type Props = {
  chunker: Chunker,
  layout: Layout,
  rowRenderer: RowRenderer,
  onLastChunk?: Function
}

type State = {
  scrollLeft: number,
  chunks: number[]
}

export default class Viewer extends PureComponent<Props, State> {
  onScroll: () => *
  view: ?HTMLDivElement

  constructor(props: Props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
    this.state = {
      scrollLeft: 0,
      chunks: props.chunker.visibleChunks(0)
    }
  }

  componentDidUpdate() {
    if (this.view) {
      this.updateChunks(this.view.scrollTop)
      if (
        this.props.chunker.lastChunk() ==
        this.state.chunks[this.state.chunks.length - 1]
      ) {
        this.props.onLastChunk && this.props.onLastChunk()
      }
    }
  }

  onScroll() {
    const view = this.view
    if (view) {
      this.updateChunks(view.scrollTop)
      this.setState({scrollLeft: view.scrollLeft})
    }
  }

  updateChunks(scrollTop: number) {
    const next = this.props.chunker.visibleChunks(scrollTop)
    const current = this.state.chunks
    if (!Chunker.isEqual(next, current)) {
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
                layout={layout}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
