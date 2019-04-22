/* @flow */

import {connect} from "react-redux"
import {isEmpty} from "lodash"
import React from "react"

import type {DispatchProps, State} from "../../state/reducers/types"
import {
  type ResultsTabEnum,
  getResultsTab,
  getTimeZone
} from "../../state/reducers/view"
import type {Space} from "../../lib/Space"
import type {ViewerDimens} from "../../types"
import {XPhonyViewer} from "../Viewer/PhonyViewer"
import {buildLogDetail} from "../../state/selectors/logDetails"
import {endMessage} from "../Viewer/Styler"
import {fetchNextPage} from "../../viewer/fetchNextPage"
import {getCurrentSpace} from "../../state/reducers/spaces"
import {getCurrentTableColumns} from "../../state/columns/selector"
import {getPrevSearchProgram} from "../../state/selectors/searchBar"
import {getSearchStatus} from "../../state/searches/selector"
import {getViewerLogs, getViewerStatus} from "../../state/viewer/selector"
import {viewLogDetail} from "../../detail/viewLogDetail"
import Chunker from "../Viewer/Chunker"
import Log from "../../models/Log"
import LogRow from "../LogRow"
import NoResults from "./NoResults"
import TableColumns from "../../models/TableColumns"
import Viewer from "../Viewer/Viewer"
import buildViewerDimens from "../Viewer/buildViewerDimens"
import dispatchToProps from "../../lib/dispatchToProps"
import getEndMessage from "./getEndMessage"
import viewerMenu from "../../rightclick/viewerMenu"

type StateProps = {|
  logs: Log[],
  selectedLog: ?Log,
  timeZone: string,
  isIncomplete: boolean,
  isFetching: boolean,
  tableColumns: TableColumns,
  tab: ResultsTabEnum,
  program: string,
  space: Space
|}

type OwnProps = {|
  height: number,
  width: number
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

export default function SearchResults(props: Props) {
  let {logs} = props

  const dimens = buildViewerDimens({
    type: props.tableColumns.showHeader() ? "fixed" : "auto",
    height: props.height,
    width: props.width,
    size: logs.length,
    rowHeight: 25,
    sumColumnWidths: props.tableColumns.sumWidths()
  })

  const chunker = new Chunker({
    size: logs.length,
    height: props.height,
    rowHeight: 25,
    chunkSize: 5,
    overScan: 3
  })

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        columns={props.tableColumns}
        key={index}
        index={index}
        log={logs[index]}
        timeZone={props.timeZone}
        highlight={Log.isSame(logs[index], props.selectedLog)}
        dimens={dimens}
        onClick={() => props.dispatch(viewLogDetail(logs[index]))}
        rightClick={viewerMenu(props.program, props.space, props.tab)}
      />
    )
  }

  function onLastChunk() {
    console.log(props.isIncomplete)
    if (props.isIncomplete && !props.isFetching) {
      props.dispatch(fetchNextPage())
    }
  }

  function renderEnd() {
    if (props.isIncomplete || props.isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(props.tab, logs.length)}
        </p>
      )
  }

  if (isEmpty(logs) && props.isFetching) return null
  if (isEmpty(logs)) return <NoResults width={props.width} />

  return (
    <div>
      <XPhonyViewer />
      <Viewer
        logs={logs}
        renderRow={renderRow}
        chunker={chunker}
        dimens={dimens}
        tableColumns={props.tableColumns}
        timeZone={props.timeZone}
        onLastChunk={onLastChunk}
        renderEnd={renderEnd}
      />
    </div>
  )
}

function stateToProps(state: State) {
  return {
    tab: getResultsTab(state),
    isFetching: getSearchStatus(state, "ViewerSearch") === "FETCHING",
    isIncomplete: getViewerStatus(state) === "INCOMPLETE",
    tableColumns: getCurrentTableColumns(state),
    timeZone: getTimeZone(state),
    selectedLog: buildLogDetail(state),
    logs: getViewerLogs(state),
    program: getPrevSearchProgram(state),
    space: getCurrentSpace(state)
  }
}

export const XSearchResults = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchResults)
