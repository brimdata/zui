/* @flow */

import React from "react"
import {AutoSizer} from "react-virtualized"
import LogViewer from "../components/LogViewer"
import NoResults from "./NoResults"
import Log from "../models/Log"
import Columns from "../models/Columns"
import {fetchAhead} from "../actions/logViewer"
import * as logDetails from "../actions/logDetails"

type Props = {
  logs: Log[],
  isComplete: boolean,
  selectedLog: Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  isFetching: boolean,
  isComplete: boolean,
  columns: Columns,
  tab: string,
  dispatch: Function
}

export default class LogResults extends React.Component<Props> {
  onLastChunk: Function
  onRowClick: Function

  constructor(props: Props) {
    super(props)
    this.onLastChunk = this.onLastChunk.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
  }

  onLastChunk() {
    if (this.props.tab === "analytics") return
    const {isFetching, isFetchingAhead, moreAhead} = this.props
    if (!isFetching && !isFetchingAhead && moreAhead) {
      this.props.dispatch(fetchAhead())
    }
  }

  onRowClick(log: Log) {
    this.props.dispatch(logDetails.viewLogDetail(log))
  }

  render() {
    if (!this.props.logs.length && this.props.isComplete) return <NoResults />
    if (!this.props.logs.length) return null

    return (
      <div className="log-results">
        <div className="log-viewer-wrapper">
          <AutoSizer>
            {({height, width}) => (
              <LogViewer
                height={height}
                width={width}
                logs={this.props.logs}
                selectedLog={this.props.selectedLog}
                timeZone={this.props.timeZone}
                columns={this.props.columns}
                onLastChunk={this.onLastChunk}
                onRowClick={this.onRowClick}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as mainSearch from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"
import * as view from "../reducers/view"
import * as logViewer from "../reducers/logViewer"
import * as columns from "../selectors/columns"
import * as logs from "../selectors/logs"

const stateToProps = state => ({
  tab: view.getResultsTab(state),
  isFetchingAhead: logViewer.isFetchingAhead(state),
  isFetching: mainSearch.getMainSearchIsFetching(state),
  isComplete: mainSearch.getMainSearchIsComplete(state),
  moreAhead: logViewer.moreAhead(state),
  columns: columns.getColumns(state),
  timeZone: getTimeZone(state),
  selectedLog: buildLogDetail(state),
  logs: logs.getLogs(state)
})

export const XLogResults = connect(stateToProps)(LogResults)
