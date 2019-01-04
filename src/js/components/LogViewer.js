/* @flow */

import React from "react"
import LogRow from "./LogRow"
import Log from "../models/Log"
import * as Layout from "./Viewer/Layout"
import type {Layout as LayoutInterface} from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"
import {XPhonyViewer} from "./Viewer/PhonyViewer"
import Columns from "../models/Columns"

type Props = {
  height: number,
  width: number,
  logs: Log[],
  selectedLog: Log,
  timeZone: string,
  columns: Columns,
  onLastChunk?: Function,
  onRowClick?: Function
}

export default class LogViewer extends React.Component<Props> {
  renderRow: Function

  constructor(props: Props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
  }

  createLayout() {
    return Layout.create({
      height: this.props.height,
      width: this.props.width,
      size: this.props.logs.length,
      rowH: 25,
      columns: this.props.columns
    })
  }

  createChunker() {
    return new Chunker({
      size: this.props.logs.length,
      height: this.props.height,
      rowHeight: 25,
      chunkSize: 5,
      overScan: 8
    })
  }

  renderRow(index: number, layout: LayoutInterface) {
    return (
      <LogRow
        key={index}
        index={index}
        log={this.props.logs[index]}
        timeZone={this.props.timeZone}
        highlight={Log.isSame(this.props.logs[index], this.props.selectedLog)}
        layout={layout}
        onClick={() =>
          this.props.onRowClick && this.props.onRowClick(this.props.logs[index])
        }
      />
    )
  }

  render() {
    if (this.props.logs.length === 0) return null
    return (
      <div>
        <XPhonyViewer data={this.props.logs} columns={this.props.columns} />
        <Viewer
          layout={this.createLayout()}
          chunker={this.createChunker()}
          onLastChunk={this.props.onLastChunk}
          rowRenderer={this.renderRow}
        />
      </div>
    )
  }
}
