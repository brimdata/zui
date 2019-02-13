/* @flow */

import {AutoSizer} from "react-virtualized"
import {connect} from "react-redux"
import React from "react"

import {type DispatchProps, type State} from "../reducers/types"
import {type ResultsTabEnum, getResultsTab, getTimeZone} from "../reducers/view"
import {buildLogDetail} from "../selectors/logDetails"
import {fetchAhead} from "../actions/logViewer"
import {getCurrentTableColumns} from "../selectors/tableColumnSets"
import {getLogs} from "../selectors/logs"
import {
  getMainSearchIsComplete,
  getMainSearchIsFetching
} from "../reducers/mainSearch"
import {isFetchingAhead, moreAhead} from "../reducers/logViewer"
import Log from "../models/Log"
import LogViewer from "../components/LogViewer"
import NoResults from "./NoResults"
import TableColumns from "../models/TableColumns"
import dispatchToProps from "../lib/dispatchToProps"
import * as logDetails from "../actions/logDetails"

type StateProps = {|
  logs: Log[],
  isComplete: boolean,
  selectedLog: ?Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  isFetching: boolean,
  isComplete: boolean,
  columns: TableColumns,
  tab: ResultsTabEnum
|}

type Props = {|...StateProps, ...DispatchProps|}

export default class LogResults extends React.Component<Props> {
  onLastChunk = () => {
    if (this.props.tab === "analytics") return
    const {isFetching, isFetchingAhead, moreAhead} = this.props
    if (!isFetching && !isFetchingAhead && moreAhead) {
      this.props.dispatch(fetchAhead())
    }
  }

  onRowClick = (index: number) => {
    const log = this.props.logs[index]
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
                atEnd={
                  !this.props.moreAhead &&
                  !this.props.isFetching &&
                  !this.props.isFetchingAhead
                }
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  tab: getResultsTab(state),
  isFetchingAhead: isFetchingAhead(state),
  isFetching: getMainSearchIsFetching(state),
  isComplete: getMainSearchIsComplete(state),
  moreAhead: moreAhead(state),
  columns: getCurrentTableColumns(state),
  timeZone: getTimeZone(state),
  selectedLog: buildLogDetail(state),
  logs: getLogs(state)
})

export const XLogResults = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LogResults)
