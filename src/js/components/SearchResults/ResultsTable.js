/* @flow */

import {connect, useDispatch} from "react-redux"
import {isEmpty} from "lodash"
import React from "react"

import type {ColumnHeadersViewState} from "../../state/Layout/types"
import type {DispatchProps, State} from "../../state/types"
import type {ScrollPosition, ViewerDimens} from "../../types"
import type {Space} from "../../state/Spaces/types"
import {endMessage} from "../Viewer/Styler"
import {fetchNextPage} from "../../flows/fetchNextPage"
import {openLogDetailsWindow} from "../../flows/openLogDetailsWindow"
import {useRowSelection} from "./selection"
import {viewLogDetail} from "../../flows/viewLogDetail"
import Chunker from "../Viewer/Chunker"
import Columns from "../../state/Columns"
import Layout from "../../state/Layout"
import Log from "../../models/Log"
import LogRow from "../LogRow"
import NoResults from "./NoResults"
import Prefs from "../../state/Prefs"
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
import useDebouncedEffect from "../hooks/useDebouncedEffect"
import useDoubleClick from "../hooks/useDoubleClick"

type StateProps = {|
  logs: Log[],
  selectedLog: ?Log,
  timeZone: string,
  timeFormat: string,
  isIncomplete: boolean,
  isFetching: boolean,
  tableColumns: TableColumns,
  columnHeadersView: ColumnHeadersViewState,
  program: string,
  space: Space,
  scrollPos: ScrollPosition
|}

type OwnProps = {|
  height: number,
  width: number
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

export default function ResultsTable(props: Props) {
  const dispatch = useDispatch()
  const {parentRef, selection, clicked} = useRowSelection({multi: false})
  const {logs, columnHeadersView} = props

  let type
  if (columnHeadersView === "AUTO") {
    type = props.tableColumns.showHeader() ? "fixed" : "auto"
  } else {
    type = columnHeadersView === "ON" ? "fixed" : "auto"
  }

  const dimens = buildViewerDimens({
    type,
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

  useDebouncedEffect(
    () => {
      if (selection.isEmpty()) return
      dispatch(viewLogDetail(logs[selection.currentRange[0]]))
    },
    400,
    [selection]
  )

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        columns={props.tableColumns}
        key={index}
        index={index}
        log={logs[index]}
        timeZone={props.timeZone}
        timeFormat={props.timeFormat}
        highlight={selection.includes(index)}
        dimens={dimens}
        onClick={(e) => {
          clicked(e, index)
        }}
        onDoubleClick={(e) => {
          clicked(e, index)
          props.dispatch(openLogDetailsWindow())
        }}
        rightClick={menu.searchFieldContextMenu(
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
      innerRef={parentRef}
      logs={logs}
      renderRow={renderRow}
      chunker={chunker}
      dimens={dimens}
      tableColumns={props.tableColumns}
      timeZone={props.timeZone}
      timeFormat={props.timeFormat}
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
      scrollPos={props.scrollPos}
    />
  )
}

function stateToProps(state: State) {
  return {
    isFetching: Viewer.getStatus(state) === "FETCHING",
    isIncomplete: Viewer.getEndStatus(state) === "INCOMPLETE",
    tableColumns: Columns.getCurrentTableColumns(state),
    columnHeadersView: Layout.getColumnHeadersView(state),
    timeZone: View.getTimeZone(state),
    timeFormat: Prefs.getTimeFormat(state),
    logs: Viewer.getLogs(state),
    program: SearchBar.getSearchProgram(state),
    space: Tab.space(state),
    scrollPos: Viewer.getScrollPos(state),
    state
  }
}

export const XResultsTable = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ResultsTable)
