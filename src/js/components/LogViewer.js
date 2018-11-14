/* @flow */

import React from "react"
import {List, AutoSizer} from "react-virtualized"
import LogRow from "./LogRow"
import Log from "../models/Log"
import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import {connect} from "react-redux"

type Props = {
  logs: Log[],
  logDetail: Log,
  timeZone: string
}

const stateToProps = state => ({
  logs: getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state)
})

export default class LogViewer extends React.PureComponent<Props> {
  render() {
    const {logs, logDetail, timeZone} = this.props
    const rowRenderer = ({key, index, style, isScrolling}) => (
      <LogRow
        key={key}
        log={logs[index]}
        timeZone={timeZone}
        highlight={Log.isSame(logs[index], logDetail)}
        style={style}
        isScrolling={isScrolling}
        index={index}
      />
    )

    const onRowsRendered = ({stopIndex}) => {
      if (logs.length - 1 === stopIndex) {
        console.log("more request")
      }
    }
    return (
      <div className="log-viewer-wrapper">
        <AutoSizer>
          {({height, width}) => {
            return (
              <List
                onRowsRendered={onRowsRendered}
                className="log-viewer"
                width={width}
                height={height}
                rowCount={logs.length}
                rowHeight={25}
                rowRenderer={rowRenderer}
                overscanRowCount={2}
              />
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}

export const XLogViewer = connect(stateToProps)(LogViewer)
