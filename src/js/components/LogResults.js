/* @flow */

import React from "react"
import {AutoSizer} from "react-virtualized"
import LogViewer from "../components/LogViewer"
import NoResults from "./NoResults"
import Log from "../models/Log"
import Columns from "../models/Columns"
import {fetchAhead} from "../actions/logViewer"
import * as logDetails from "../actions/logDetails"
import {connect} from "react-redux"
import * as mainSearch from "../reducers/mainSearch"
import {buildLogDetail} from "../selectors/logDetails"
import {getTimeZone} from "../reducers/view"
import * as view from "../reducers/view"
import * as logViewer from "../reducers/logViewer"
import * as columns from "../selectors/columns"
import * as logs from "../selectors/logs"
import {type DispatchProps} from "../reducers/types"
import {type State} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import {type ResultsTabEnum} from "../reducers/view"

type StateProps = {|
  logs: Log[],
  isComplete: boolean,
  selectedLog: ?Log,
  timeZone: string,
  moreAhead: boolean,
  isFetchingAhead: boolean,
  isFetching: boolean,
  isComplete: boolean,
  columns: Columns,
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

export const XLogResults = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LogResults)
