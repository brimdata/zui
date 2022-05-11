import nextPageViewerSearch from "src/app/search/flows/next-page-viewer-search"
import {debounce, isEmpty} from "lodash"
import React, {useEffect, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import Url from "src/js/state/Url"
import {openLogDetailsWindow} from "../../flows/openLogDetailsWindow"
import {viewLogDetail} from "../../flows/viewLogDetail"
import Columns from "../../state/Columns"
import Layout from "../../state/Layout"
import Viewer from "../../state/Viewer"
import {ViewerDimens} from "../../types"
import LogRow from "../LogRow"
import buildViewerDimens from "../Viewer/buildViewerDimens"
import Chunker from "../Viewer/Chunker"
import {endMessage} from "../Viewer/Styler"
import ViewerComponent from "../Viewer/Viewer"
import getEndMessage from "./getEndMessage"
import NoResults from "./NoResults"
import {useRowSelection} from "./selection"

type Props = {
  height: number
  width: number
  multiSelect: boolean
}

export default function ResultsTable(props: Props) {
  const program = useSelector(Url.getSearchProgram)
  const isFetching = useSelector(Viewer.getStatus) === "FETCHING"
  const isIncomplete = useSelector(Viewer.getStatus) === "INCOMPLETE"
  const tableColumns = useSelector(Columns.getCurrentTableColumns)
  const columnHeadersView = useSelector(Layout.getColumnsView)
  const logs = useSelector(Viewer.getLogs)
  const scrollPos = useSelector(Viewer.getScrollPos)
  const dispatch = useDispatch()
  const displayConfig = useSelector(ConfigPropValues.get("display"))
  const {parentRef, selection, clicked} = useRowSelection({
    multi: props.multiSelect,
  })

  let type
  if (columnHeadersView === "AUTO") {
    type = tableColumns.showHeader() ? "fixed" : "auto"
  } else {
    type = columnHeadersView === "ON" ? "fixed" : "auto"
  }

  const dimens = useMemo(
    () =>
      buildViewerDimens({
        type,
        height: props.height,
        width: props.width,
        size: logs.length,
        rowHeight: 25,
        sumColumnWidths: tableColumns.sumWidths(),
      }),
    [type, props.height, props.width, logs.length, tableColumns]
  )

  const chunker = new Chunker({
    size: logs.length,
    height: props.height,
    rowHeight: 25,
    chunkSize: 5,
    overScan: 1,
  })

  useEffect(() => {
    if (selection.isEmpty()) return
    dispatch(viewLogDetail(logs[selection.currentRange[0]]))
  }, [selection])

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        displayConfig={displayConfig}
        columns={tableColumns}
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
    if (isIncomplete && !isFetching) {
      dispatch(nextPageViewerSearch())
    }
  }

  function renderEnd() {
    if (isIncomplete || isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(program, logs.length)}
        </p>
      )
  }

  function onScroll({top, left}) {
    dispatch(Viewer.setScroll({y: top, x: left}))
  }

  const safeOnScroll = useMemo(
    () => debounce(onScroll, 250, {trailing: true, leading: false}),
    []
  )

  if (isEmpty(logs) && isFetching) return null
  if (isEmpty(logs)) return <NoResults width={props.width} />

  return (
    <ViewerComponent
      onScroll={safeOnScroll}
      innerRef={parentRef}
      logs={logs}
      renderRow={renderRow}
      chunker={chunker}
      dimens={dimens}
      tableColumns={tableColumns}
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
      scrollPos={scrollPos}
    />
  )
}
