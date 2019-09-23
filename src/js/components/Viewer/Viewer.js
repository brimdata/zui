/* @flow */

import * as React from "react"

import type {RowRenderer, ViewerDimens} from "../../types"
import {reactElementProps} from "../../test/integration"
import Chunk from "./Chunk"
import Chunker from "./Chunker"
import Header from "./Header"
import Log from "../../models/Log"
import ScrollHooks from "../../lib/ScrollHooks"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import lib from "../../lib"

type Props = {
  chunker: Chunker,
  dimens: ViewerDimens,
  tableColumns: TableColumns,
  renderRow: RowRenderer,
  logs: Log[],
  onLastChunk?: Function,
  renderEnd: () => *
}

type State = {
  scrollLeft: number,
  chunks: number[]
}

export default class Viewer extends React.PureComponent<Props, State> {
  scrollHooks: Function
  view: ?HTMLDivElement

  constructor(props: Props) {
    super(props)
    this.state = {
      scrollLeft: 0,
      chunks: props.chunker.visibleChunks(0)
    }
    this.scrollHooks = ScrollHooks.create(this.onScrollStart, this.onScrollStop)
  }

  componentDidUpdate() {
    if (!this.view) return
    this.updateChunks(this.view.scrollTop)
    if (
      this.props.chunker.lastChunk() ==
      this.state.chunks[this.state.chunks.length - 1]
    ) {
      this.props.onLastChunk && this.props.onLastChunk()
    }
  }

  onScrollStart() {
    lib.doc.id("tooltip-root").style.display = "none"
  }

  onScrollStop() {
    lib.doc.id("tooltip-root").style.display = "block"
  }

  onScroll = () => {
    this.scrollHooks()
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
    const {scrollLeft, chunks} = this.state
    return (
      <div className="viewer" style={{width: this.props.dimens.viewWidth}}>
        <Header
          columns={this.props.tableColumns}
          dimens={this.props.dimens}
          scrollLeft={scrollLeft}
          {...reactElementProps("viewer_header")}
        />
        <div
          className="view"
          onScroll={this.onScroll}
          style={{
            width: this.props.dimens.viewWidth,
            height: this.props.dimens.viewHeight
          }}
          ref={(r) => (this.view = r)}
        >
          <List {...{...this.props, chunks}} />
        </div>
      </div>
    )
  }
}

const List = React.memo(function List(props) {
  return (
    <div
      className="list"
      style={Styler.list(props.dimens)}
      {...reactElementProps("viewer_results")}
    >
      {props.chunks.map((chunk) => (
        <Chunk
          columns={props.tableColumns}
          logs={props.logs}
          rows={props.chunker.rows(chunk)}
          key={chunk}
          rowRenderer={props.renderRow}
          dimens={props.dimens}
        />
      ))}
      {props.renderEnd()}
    </div>
  )
})
