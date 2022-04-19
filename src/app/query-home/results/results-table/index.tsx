import {debounce, isEmpty} from "lodash"
import React, {useEffect, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import Columns from "src/js/state/Columns"
import Layout from "src/js/state/Layout"
import Viewer from "src/js/state/Viewer"
import {ViewerDimens} from "src/js/types"
import LogRow from "src/js/components/LogRow"
import buildViewerDimens from "src/js/components/Viewer/buildViewerDimens"
import Chunker from "src/js/components/Viewer/Chunker"
import {endMessage} from "src/js/components/Viewer/Styler"
import ViewerComponent from "./viewer"
import getEndMessage from "./get-end-message"
import NoResults from "./no-results"
import {useRowSelection} from "./hooks/use-row-selection"
import Current from "src/js/state/Current"
import nextPageViewerSearch from "src/app/query-home/flows/next-page-viewer-search"

type Props = {
  height: number
  width: number
  multiSelect: boolean
}

const ResultsTable = (props: Props) => {
  const queryValue = useSelector(Current.getQuery)?.value
  const isFetching = useSelector(Viewer.getStatus) === "FETCHING"
  const isIncomplete = useSelector(Viewer.getEndStatus) === "INCOMPLETE"
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
          {getEndMessage(queryValue, logs.length)}
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

export default ResultsTable
