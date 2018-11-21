/* @flow */

import React from "react"
import LogRow from "./LogRow"
import Log from "../models/Log"
import * as Layout from "./Viewer/Layout"
import type {Layout as LayoutInterface} from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"
import ColumnWidths from "./Viewer/ColumnWidths"
import * as actions from "../actions/logViewer"

type Props = {
  height: number,
  width: number,
  logs: Log[],
  logDetail: Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  columnWidths?: ColumnWidths,
  dispatch: Function
}

export default class LogViewer extends React.Component<Props> {
  createLayout() {
    return Layout.create({
      height: this.props.height,
      width: this.props.width,
      size: this.props.logs.length,
      rowH: 25,
      columnWidths: this.props.columnWidths
    })
  }

  createChunker() {
    return new Chunker({
      size: this.props.logs.length,
      height: this.props.height,
      rowHeight: 25,
      chunkSize: 5,
      overScan: 2
    })
  }

  onRowsRendered(stopIndex: number) {
    const reachedEnd = this.props.logs.length - 1 === stopIndex

    if (reachedEnd && this.props.moreAhead && !this.props.isFetchingAhead) {
      this.props.dispatch(actions.fetchAhead())
    }
  }

  renderRow(index: number, isScrolling: boolean, layout: LayoutInterface) {
    return (
      <LogRow
        key={index}
        index={index}
        log={this.props.logs[index]}
        timeZone={this.props.timeZone}
        highlight={Log.isSame(this.props.logs[index], this.props.logDetail)}
        isScrolling={isScrolling}
        layout={layout}
      />
    )
  }

  render() {
    return (
      <Viewer
        layout={this.createLayout()}
        chunker={this.createChunker()}
        onRowsRendered={this.onRowsRendered.bind(this)}
        rowRenderer={this.renderRow.bind(this)}
      />
    )
  }
}

import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import * as logViewer from "../reducers/logViewer"
import * as columns from "../reducers/columns"
import {connect} from "react-redux"

const stateToProps = (state): $Shape<Props> => ({
  logs: getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state),
  moreAhead: logViewer.moreAhead(state),
  isFetchingAhead: logViewer.isFetchingAhead(state),
  columnWidths: columns.getWidths(state)
})

export const XLogViewer = connect(
  stateToProps,
  (dispatch: *) => ({dispatch})
)(LogViewer)
