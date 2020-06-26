/* @flow */

import {connect} from "react-redux"
import {isEmpty} from "lodash"
import Mousetrap from "mousetrap"
import React, {useEffect, useState} from "react"
import throttle from "lodash/throttle"

import type {DispatchProps, State} from "../../state/types"
import type {Space} from "../../state/Spaces/types"
import type {ViewerDimens} from "../../types"
import {endMessage} from "../Viewer/Styler"
import {fetchNextPage} from "../../flows/fetchNextPage"
import {openLogDetailsWindow} from "../../flows/openLogDetailsWindow"
import {viewLogDetail} from "../../flows/viewLogDetail"
import Chunker from "../Viewer/Chunker"
import Columns from "../../state/Columns"
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
  program: string,
  space: Space,
  scrollX: number,
  scrollY: number
|}

type OwnProps = {|
  height: number,
  width: number
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

export default function ResultsTable(props: Props) {
  const [selectedNdx, setSelectedNdx] = useState(0)
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

  const adjustSelectedLogIndex = (indexDelta: number) => {
    setSelectedNdx((currentNdx) => {
      const newNdx = currentNdx + indexDelta
      if (newNdx < 0 || newNdx > logs.length - 1) return currentNdx
      return newNdx
    })
  }

  useEffect(() => {
    Mousetrap.bind(
      "down",
      throttle((e) => {
        e.preventDefault()
        adjustSelectedLogIndex(1)
      }, 100)
    )
    Mousetrap.bind(
      "up",
      throttle((e) => {
        e.preventDefault()
        adjustSelectedLogIndex(-1)
      }, 100)
    )
  }, [])

  useDebouncedEffect(
    () => {
      props.dispatch(viewLogDetail(logs[selectedNdx]))
    },
    200,
    [selectedNdx]
  )

  const onSingleClick = () => {
    props.dispatch(viewLogDetail(logs[selectedNdx]))
  }

  const onDoubleClick = () => {
    props.dispatch(viewLogDetail(logs[selectedNdx]))
    props.dispatch(openLogDetailsWindow())
  }

  const clickHandler = useDoubleClick(onSingleClick, onDoubleClick)

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        columns={props.tableColumns}
        key={index}
        index={index}
        log={logs[index]}
        timeZone={props.timeZone}
        timeFormat={props.timeFormat}
        highlight={Log.isSame(logs[index], logs[selectedNdx])}
        dimens={dimens}
        onClick={() => {
          setSelectedNdx(index)
          clickHandler()
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
      logs={logs}
      renderRow={renderRow}
      chunker={chunker}
      dimens={dimens}
      tableColumns={props.tableColumns}
      timeZone={props.timeZone}
      timeFormat={props.timeFormat}
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
      scrollX={props.scrollX}
      scrollY={props.scrollY}
    />
  )
}

function stateToProps(state: State) {
  return {
    isFetching: Viewer.getStatus(state) === "FETCHING",
    isIncomplete: Viewer.getEndStatus(state) === "INCOMPLETE",
    tableColumns: Columns.getCurrentTableColumns(state),
    timeZone: View.getTimeZone(state),
    timeFormat: Prefs.getTimeFormat(state),
    logs: Viewer.getLogs(state),
    program: SearchBar.getSearchProgram(state),
    space: Tab.space(state),
    scrollX: Viewer.getScrollX(state),
    scrollY: Viewer.getScrollY(state),
    state
  }
}

export const XResultsTable = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ResultsTable)
