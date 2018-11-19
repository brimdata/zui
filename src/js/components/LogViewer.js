import {connect} from "react-redux"
import React from "react"
import {List} from "react-virtualized"
import LogRow from "./LogRow"
import Log from "../models/Log"
import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import {connect} from "react-redux"
import * as actions from "../actions/logViewer"
import * as logViewer from "../reducers/logViewer"
import type {Dispatch} from "redux"

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
  isFetchingAhead: logViewer.isFetchingAhead(state)
})

export default class LogViewer extends React.Component<Props> {
  render() {
    const {width, height, logs, logDetail, timeZone} = this.props
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
      const reachedEnd = logs.length - 1 === stopIndex

      if (reachedEnd && this.props.moreAhead && !this.props.isFetchingAhead) {
        this.props.dispatch(actions.fetchAhead())
      }
    }

    return (
      <List
        className="log-viewer"
        width={width}
        height={height}
        rowCount={logs.length}
        rowHeight={25}
        rowRenderer={rowRenderer}
        overscanRowCount={2}
      />
    )
  }
}

export const XLogViewer = connect(stateToProps)(LogViewer)
