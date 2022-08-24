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
import Chunker from "src/app/query-home/results/results-table/chunker"
import ViewerComponent from "./viewer"
import getEndMessage from "./get-end-message"
import NoResults from "./no-results"
import {useRowSelection} from "./hooks/use-row-selection"
import Results from "src/js/state/Results"
import {zed} from "packages/zealot/src"
import buildViewerDimens from "./viewer/build-viewer-dimens"
import {MAIN_RESULTS} from "src/js/state/Results/types"

type Props = {
  height: number
  width: number
}

const endMessage = (dimens: ViewerDimens) => {
  return {
    height: dimens.rowHeight * 4,
    transform: `translateY(${dimens.listHeight}px)`,
    width: dimens.viewWidth,
  }
}

const ResultsTable = (props: Props) => {
  const status = useSelector(Results.getStatus(MAIN_RESULTS))
  const aggregationLimit = useSelector(
    Results.getAggregationLimit(MAIN_RESULTS)
  )
  const isFetching = useSelector(Results.isFetching(MAIN_RESULTS))
  const isIncomplete = useSelector(Results.isIncomplete(MAIN_RESULTS))
  const tableColumns = useSelector(Columns.getCurrentTableColumns)
  const columnHeadersView = useSelector(Layout.getColumnsView)
  const logs = useSelector(Results.getValues(MAIN_RESULTS)) as zed.Record[]
  const scrollPos = useSelector(Viewer.getScrollPos)
  const dispatch = useDispatch()
  const displayConfig = useSelector(ConfigPropValues.get("display"))
  const {parentRef, selection, clicked} = useRowSelection({
    count: logs.length,
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
          dispatch(openLogDetailsWindow(logs[index]))
        }}
      />
    )
  }

  function onLastChunk() {
    if (isIncomplete && !isFetching) {
      dispatch(Results.fetchNextPage())
    }
  }

  function renderEnd() {
    if (isIncomplete || isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(status, aggregationLimit)}
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
  if (isEmpty(logs)) return <NoResults />

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
