/* @flow */

import {connect} from "react-redux"
import React from "react"
import LogRow from "./LogRow"
import Log from "../models/Log"
import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import {connect} from "react-redux"
import * as actions from "../actions/logViewer"
import * as logViewer from "../reducers/logViewer"
import type {Dispatch} from "redux"
import * as columnWidths from "../reducers/columnWidths"
import Layout from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"
import AutoColumns from "./Viewer/AutoColumns"
import FixedColumns from "./Viewer/FixedColumns"
import * as columns from "../reducers/columns"
import Layout from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"

type Props = {
  logs: Log[],
  logDetail: Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  dispatch: Dispatch<*>
}

const stateToProps = (state): $Shape<Props> => ({
  logs: getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state),
  moreAhead: logViewer.moreAhead(state),
  isFetchingAhead: logViewer.isFetchingAhead(state),
  columnManager: columns.getManager(state)
})

export default class LogViewer extends React.Component<Props> {
  render() {
    const layout = buildLayout(this.props)
    return (
      <Viewer
        layout={layout}
        chunker={buildChunker(this.props)}
        rowRenderer={({index, isScrolling}) => (
          <LogRow
            key={index}
            index={index}
            log={this.props.logs[index]}
            timeZone={this.props.timeZone}
            highlight={Log.isSame(this.props.logs[index], this.props.logDetail)}
            isScrolling={isScrolling}
            layout={layout}
          />
        )}
      />
    )

    const onRowsRendered = ({stopIndex}) => {
      const reachedEnd = logs.length - 1 === stopIndex

      if (reachedEnd && this.props.moreAhead && !this.props.isFetchingAhead) {
        this.props.dispatch(actions.fetchAhead())
      }
    }

    return (
      <Viewer layout={layout} chunker={chunker} rowRenderer={rowRenderer} />
    )
  }
}

const buildChunker = ({logs, height}) =>
  new Chunker({
    size: logs.length,
    height: height,
    rowHeight: 25,
    chunkSize: 5,
    overScan: 2
  })

const buildLayout = ({height, width, logs, columnManager}) =>
  new Layout({
    width,
    height,
    rowHeight: 25,
    size: logs.length,
    columnManager
  })

export const XLogViewer = connect(stateToProps)(LogViewer)
