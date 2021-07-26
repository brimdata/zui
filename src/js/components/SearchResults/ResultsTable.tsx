import nextPageViewerSearch from "app/search/flows/next-page-viewer-search"
import {isEmpty} from "lodash"
import React, {useEffect} from "react"
import {connect, useDispatch, useSelector} from "react-redux"
import {zed} from "zealot"
import {openLogDetailsWindow} from "../../flows/openLogDetailsWindow"
import {viewLogDetail} from "../../flows/viewLogDetail"
import dispatchToProps from "../../lib/dispatchToProps"
import TableColumns from "../../models/TableColumns"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import Layout from "../../state/Layout"
import {ColumnHeadersViewState} from "../../state/Layout/types"
import SearchBar from "../../state/SearchBar"
import {Pool} from "../../state/Pools/types"
import {DispatchProps, State} from "../../state/types"
import Viewer from "../../state/Viewer"
import {ScrollPosition, ViewerDimens} from "../../types"
import LogRow from "../LogRow"
import buildViewerDimens from "../Viewer/buildViewerDimens"
import Chunker from "../Viewer/Chunker"
import {endMessage} from "../Viewer/Styler"
import ViewerComponent from "../Viewer/Viewer"
import getEndMessage from "./getEndMessage"
import NoResults from "./NoResults"
import {useRowSelection} from "./selection"
import ConfigPropValues from "src/js/state/ConfigPropValues"

type StateProps = {
  logs: zed.Record[]
  isIncomplete: boolean
  isFetching: boolean
  tableColumns: TableColumns
  columnHeadersView: ColumnHeadersViewState
  program: string
  pool: Pool
  scrollPos: ScrollPosition
}

type OwnProps = {
  height: number
  width: number
  multiSelect: boolean
}

type Props = StateProps & DispatchProps & OwnProps

export default function ResultsTable(props: Props) {
  const dispatch = useDispatch()
  const displayConfig = useSelector(ConfigPropValues.get("display"))
  const {parentRef, selection, clicked} = useRowSelection({
    multi: props.multiSelect
  })
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

  useEffect(() => {
    if (selection.isEmpty()) return
    dispatch(viewLogDetail(logs[selection.currentRange[0]]))
  }, [selection])

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        displayConfig={displayConfig}
        columns={props.tableColumns}
        key={index}
        index={index}
        log={logs[index]}
        highlight={selection.includes(index)}
        dimens={dimens}
        onClick={(e) => clicked(e, index)}
        onDoubleClick={() => {
          dispatch(viewLogDetail(logs[index]))
          dispatch(openLogDetailsWindow())
        }}
      />
    )
  }

  function onLastChunk() {
    if (props.isIncomplete && !props.isFetching) {
      props.dispatch(nextPageViewerSearch())
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
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
      scrollPos={props.scrollPos}
    />
  )
}

function stateToProps(state: State): StateProps {
  return {
    isFetching: Viewer.getStatus(state) === "FETCHING",
    isIncomplete: Viewer.getEndStatus(state) === "INCOMPLETE",
    tableColumns: Columns.getCurrentTableColumns(state),
    columnHeadersView: Layout.getColumnHeadersView(state),
    logs: Viewer.getLogs(state),
    program: SearchBar.getSearchProgram(state),
    pool: Current.getPool(state),
    scrollPos: Viewer.getScrollPos(state)
  }
}

export const XResultsTable = connect<StateProps, DispatchProps, OwnProps>(
  stateToProps,
  dispatchToProps
)(ResultsTable)
