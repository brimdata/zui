/* @flow */

import {connect} from "react-redux"
import {isEmpty} from "lodash"
import React from "react"

import type {DispatchProps, State} from "../../state/types"
import type {Space} from "../../state/Spaces/types"
import type {ViewerDimens} from "../../types"
import {endMessage} from "../Viewer/Styler"
import {fetchNextPage} from "../../flows/fetchNextPage"
import {viewLogDetail} from "../../flows/viewLogDetail"
import Chunker from "../Viewer/Chunker"
import Columns from "../../state/Columns"
import Log from "../../models/Log"
import LogDetails from "../../state/LogDetails"
import LogRow from "../LogRow"
import NoResults from "./NoResults"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import TableColumns from "../../models/TableColumns"
import View from "../../state/View"
import Viewer from "../../state/Viewer"
import ViewerComponent from "../Viewer/Viewer"
import buildViewerDimens from "../Viewer/buildViewerDimens"
import dispatchToProps from "../../lib/dispatchToProps"
import getEndMessage from "./getEndMessage"
import menu from "../../electron/menu"

type StateProps = {|
  logs: Log[],
  selectedLog: ?Log,
  timeZone: string,
  isIncomplete: boolean,
  isFetching: boolean,
  tableColumns: TableColumns,
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
    overScan: 1
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
        rightClick={menu.fieldContextMenu(
          props.program,
          props.tableColumns.getColumns().map((c) => c.name),
          props.space
        )}
      />
    )
  }

  function onLastChunk() {
    if (props.isIncomplete && !props.isFetching) {
      props.dispatch(fetchNextPage())
    }
  }

  function renderEnd() {
    if (props.isIncomplete || props.isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(props.program, logs.length)}
        </p>
      )
  }

  if (isEmpty(logs) && props.isFetching) return null
  if (isEmpty(logs)) return <NoResults width={props.width} />

  return (
    <ViewerComponent
      logs={logs}
      renderRow={renderRow}
      chunker={chunker}
      dimens={dimens}
      tableColumns={props.tableColumns}
      timeZone={props.timeZone}
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
    />
  )
}

function stateToProps(state: State) {
  return {
    isFetching: Viewer.getStatus(state) === "FETCHING",
    isIncomplete: Viewer.getEndStatus(state) === "INCOMPLETE",
    tableColumns: Columns.getCurrentTableColumns(state),
    timeZone: View.getTimeZone(state),
    selectedLog: LogDetails.build(state),
    logs: Viewer.getLogs(state),
    program: SearchBar.getSearchProgram(state),
    space: Tab.space(state)
  }
}

export const XSearchResults = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchResults)
