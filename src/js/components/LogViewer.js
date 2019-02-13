/* @flow */

import React from "react"

import type {ViewerDimens} from "../types"
import {XPhonyViewer} from "./Viewer/PhonyViewer"
import {create} from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Log from "../models/Log"
import LogRow from "./LogRow"
import TableColumns from "../models/TableColumns"
import Viewer from "./Viewer/Viewer"

type Props = {
  height: number,
  width: number,
  logs: Log[],
  selectedLog: ?Log,
  timeZone: string,
  tableColumns: TableColumns,
  atEnd: boolean,
  onLastChunk?: Function,
  onRowClick?: Function
}

type State = {
  selectedIndex: ?number
}

export default class LogViewer extends React.Component<Props, State> {
  state = {selectedIndex: null}

  createLayout() {
    return create({
      type: this.props.tableColumns.showHeader() ? "fixed" : "auto",
      height: this.props.height,
      width: this.props.width,
      size: this.props.logs.length,
      rowHeight: 25,
      sumColumnWidths: this.props.tableColumns.sumWidths()
    })
  }

  createChunker() {
    return new Chunker({
      size: this.props.logs.length,
      height: this.props.height,
      rowHeight: 25,
      chunkSize: 5,
      overScan: 3
    })
  }

  renderRow = (index: number, dimens: ViewerDimens) => {
    return (
      <LogRow
        columns={this.props.tableColumns.getColumns()}
        key={index}
        index={index}
        log={this.props.logs[index]}
        timeZone={this.props.timeZone}
        highlight={Log.isSame(this.props.logs[index], this.props.selectedLog)}
        dimens={dimens}
        onClick={() => {
          this.props.onRowClick && this.props.onRowClick(index)
        }}
      />
    )
  }

  render() {
    if (this.props.logs.length === 0) return null
    return (
      <div>
        <XPhonyViewer />
        <Viewer
          tableColumns={this.props.tableColumns}
          logs={this.props.logs}
          dimens={this.createLayout()}
          chunker={this.createChunker()}
          onLastChunk={this.props.onLastChunk}
          rowRenderer={this.renderRow}
          selectedLog={this.props.selectedLog}
          atEnd={this.props.atEnd}
        />
      </div>
    )
  }
}
