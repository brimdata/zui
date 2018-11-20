/* @flow */

import {connect} from "react-redux"
import React from "react"
import LogRow from "./LogRow"
import Log from "../models/Log"
import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
<<<<<<< HEAD
<<<<<<< HEAD
import {connect} from "react-redux"
import * as actions from "../actions/logViewer"
import * as logViewer from "../reducers/logViewer"
import type {Dispatch} from "redux"
=======
=======
import * as columnWidths from "../reducers/columnWidths"
>>>>>>> Resize columns and save that state
import Layout from "./Viewer/Layout"
import Chunker from "./Viewer/Chunker"
import Viewer from "./Viewer/Viewer"
import AutoColumns from "./Viewer/AutoColumns"
import FixedColumns from "./Viewer/FixedColumns"
>>>>>>> Drop in new Viewer components

type Props = {
  logs: Log[],
  logDetail: Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  dispatch: Dispatch<*>
}

<<<<<<< HEAD
const stateToProps = (state): $Shape<Props> => ({
=======
type Props = {
  logs: Log[],
  logDetail: Log,
  timeZone: string,
  width: number,
  height: number,
  columnWidths: {[string]: number, default: number}
}

const stateToProps = state => ({
>>>>>>> Flow the LogViewer
  logs: getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state),
<<<<<<< HEAD
  moreAhead: logViewer.moreAhead(state),
  isFetchingAhead: logViewer.isFetchingAhead(state)
=======
  columnWidths: columnWidths.getAll(state)
>>>>>>> Resize columns and save that state
})

<<<<<<< HEAD
export default class LogViewer extends React.Component<Props> {
=======
export default class LogViewer extends React.PureComponent<Props> {
>>>>>>> Flow the LogViewer
  render() {
    const {width, height, logs, logDetail, timeZone} = this.props

    const layout = new Layout({
      width,
      height,
      rowHeight: 25,
      size: logs.length,
      columnManager: new FixedColumns(
        [
          "ts",
          "_path",
          "uid",
          "id.orig_h",
          "id.orig_p",
          "id.resp_h",
          "id.resp_p"
        ],
        this.props.columnWidths
      )
    })

    const chunker = new Chunker({
      size: logs.length,
      height: height,
      rowHeight: 25,
      chunkSize: 5,
      overScan: 2
    })

    const rowRenderer = ({index, isScrolling}) => (
      <LogRow
        key={index}
        index={index}
        log={logs[index]}
        timeZone={timeZone}
        highlight={Log.isSame(logs[index], logDetail)}
        isScrolling={isScrolling}
        layout={layout}
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

export const XLogViewer = connect(stateToProps)(LogViewer)
