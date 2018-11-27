/* @flow */

import React from "react"
import LogRow from "./LogRow"
import Log from "../models/Log"
import * as Layout from "./Viewer/Layout"
import type {Layout as LayoutInterface} from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"
import ColumnWidths from "./Viewer/ColumnWidths"
import PhonyViewer from "./Viewer/PhonyViewer"
import * as columnWidths from "../actions/columnWidths"
import * as actions from "../actions/logViewer"
import Columns from "../models/Columns"

type Props = {
  height: number,
  width: number,
  logs: Log[],
  logDetail: Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  columnWidths?: ColumnWidths,
  isFetching: boolean,
  isComplete: boolean,
  columns: Columns,
  dispatch: Function
}

export default class LogViewer extends React.Component<Props> {
  measured: boolean
  onLastChunk: Function

  constructor(props: Props) {
    super(props)
    this.measured = false
    this.onLastChunk = this.onLastChunk.bind(this)
  }

  createLayout() {
    return Layout.create({
      height: this.props.height,
      width: this.props.width,
      size: this.props.logs.length,
      rowH: 25,
      columnWidths: this.props.columnWidths,
      columnsRename: this.props.columns
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

  onLastChunk() {
    const {isFetching, isFetchingAhead, moreAhead} = this.props
    if (!isFetching && !isFetchingAhead && moreAhead) {
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

  measureColWidths(ref: HTMLTableElement) {
    let colWidths = {}
    ref.querySelectorAll("th").forEach(th => {
      colWidths[th.innerHTML] = th.getBoundingClientRect().width
    })
    this.props.dispatch(columnWidths.setWidths(colWidths))
    this.measured = true
  }

  shouldRenderPhony() {
    if (this.measured) return false
    if (!this.props.columnWidths) return false
    if (this.props.isComplete) return true
    if (this.props.logs.length >= 10) return true
  }

  render() {
    if (this.props.logs === 0) return null

    return (
      <div>
        {this.shouldRenderPhony() && (
          <PhonyViewer
            data={this.props.logs}
            layout={this.createLayout()}
            onMount={this.measureColWidths.bind(this)}
          />
        )}
        <Viewer
          layout={this.createLayout()}
          chunker={this.createChunker()}
          onLastChunk={this.onLastChunk}
          rowRenderer={this.renderRow.bind(this)}
        />
      </div>
    )
  }
}

import * as mainSearch from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import * as logViewer from "../reducers/logViewer"
import * as columns from "../reducers/columns"
import {connect} from "react-redux"

const stateToProps = (state): $Shape<Props> => ({
  logs: mainSearch.getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state),
  moreAhead: logViewer.moreAhead(state),
  isFetchingAhead: logViewer.isFetchingAhead(state),
  columnWidths: columns.getWidths(state),
  isFetching: mainSearch.getMainSearchIsFetching(state),
  isComplete: mainSearch.getMainSearchIsComplete(state),
  columns: columns.getColumns(state)
})

export const XLogViewer = connect(
  stateToProps,
  (dispatch: *) => ({dispatch})
)(LogViewer)
