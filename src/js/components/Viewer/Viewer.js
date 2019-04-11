/* @flow */

import * as React from "react"

import type {RowRenderer, ViewerDimens} from "../../types"
import Chunk from "./Chunk"
import Chunker from "./Chunker"
import * as Doc from "../../lib/Doc"
import Header from "./Header"
import Log from "../../models/Log"
import ScrollHooks from "../../lib/ScrollHooks"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"

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
    Doc.id("tooltip-root").style.display = "none"
  }

  onScrollStop() {
    Doc.id("tooltip-root").style.display = "block"
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
    const {
      dimens,
      chunker,
      renderRow,
      logs,
      tableColumns,
      renderEnd
    } = this.props
    const {scrollLeft, chunks} = this.state
    return (
      <div className="viewer" style={{width: dimens.viewWidth}}>
        <Header
          columns={tableColumns}
          dimens={dimens}
          scrollLeft={scrollLeft}
        />
        <div
          className="view"
          onScroll={this.onScroll}
          style={{width: dimens.viewWidth, height: dimens.viewHeight}}
          ref={(r) => (this.view = r)}
        >
          <div className="list" style={Styler.list(dimens)}>
            {chunks.map((chunk) => (
              <Chunk
                columns={this.props.tableColumns}
                logs={logs}
                rows={chunker.rows(chunk)}
                key={chunk}
                rowRenderer={renderRow}
                dimens={dimens}
              />
            ))}
            {renderEnd()}
          </div>
        </div>
      </div>
    )
  }
}
