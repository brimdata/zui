/* @flow */

import React, {PureComponent} from "react"
import Header from "./Header"
import Chunk from "./Chunk"
import * as Styler from "./Styler"
import Chunker from "./Chunker"
import type {Layout} from "./Layout"
import type {RowRenderer, OnRowsRendered} from "./types"

type Props = {
  chunker: Chunker,
  layout: Layout,
  rowRenderer: RowRenderer,
  onRowsRendered: OnRowsRendered
}

type State = {
  scrollLeft: number,
  chunks: number[],
  isScrolling: boolean
}

export default class Viewer extends PureComponent<Props, State> {
  id: TimeoutID
  onScroll: () => *
  view: ?HTMLDivElement

  constructor(props: Props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
    this.state = {
      scrollLeft: 0,
      chunks: props.chunker.visibleChunks(0),
      isScrolling: false
    }
  }

  componentDidUpdate() {
    if (this.view) this.updateChunks(this.view.scrollTop)
  }

  onScroll() {
    const {view, id} = this
    if (view) {
      clearTimeout(id)
      this.updateChunks(view.scrollTop)
      this.setState({scrollLeft: view.scrollLeft, isScrolling: true})
      this.id = setTimeout(() => this.setState({isScrolling: false}), 150)
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
                layout={layout}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
