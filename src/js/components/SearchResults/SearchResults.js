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
import type {Tuple, ViewerDimens} from "../../types"
import {XPhonyViewer} from "../Viewer/PhonyViewer"
import {buildLogDetail} from "../../state/selectors/logDetails"
import {endMessage} from "../Viewer/Styler"
import {fetchAhead} from "../../state/thunks/logViewer"
import {getCurrentSpace} from "../../state/reducers/spaces"
import {getCurrentTableColumns} from "../../state/selectors/tableColumnSets"
import {getLogs, getTuples} from "../../state/selectors/logs"
import {getMainSearchIsFetching} from "../../state/selectors/boomSearches"
import {getPrevSearchProgram} from "../../state/selectors/searchBar"
import {moreAhead} from "../../state/reducers/logViewer"
import {viewLogDetail} from "../../state/thunks/logDetails"
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
  moreAhead: boolean,
  isFetching: boolean,
  tuples: Tuple[],
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
  const dimens = buildViewerDimens({
    type: props.tableColumns.showHeader() ? "fixed" : "auto",
    height: props.height,
    width: props.width,
    size: props.logs.length,
    rowHeight: 25,
    sumColumnWidths: props.tableColumns.sumWidths()
  })

  const chunker = new Chunker({
    size: props.logs.length,
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
        log={props.logs[index]}
        timeZone={props.timeZone}
        highlight={Log.isSame(props.logs[index], props.selectedLog)}
        dimens={dimens}
        onClick={() => props.dispatch(viewLogDetail(props.logs[index]))}
        rightClick={viewerMenu(props.program, props.space, props.tab)}
      />
    )
  }

  function onLastChunk() {
    if (props.moreAhead && !props.isFetching && props.tab === "logs") {
      props.dispatch(fetchAhead())
    }
  }

  function renderEnd() {
    if (props.moreAhead || props.isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(props.tab, props.logs.length)}
        </p>
      )
  }

  if (isEmpty(props.tuples) && !props.isFetching)
    return <NoResults width={props.width} />
  else if (isEmpty(props.logs)) return null
  else
    return (
      <div>
        <XPhonyViewer />
        <Viewer
          logs={props.logs}
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

const stateToProps = (state: State) => ({
  tab: getResultsTab(state),
  isFetching: getMainSearchIsFetching(state),
  moreAhead: moreAhead(state),
  tableColumns: getCurrentTableColumns(state),
  timeZone: getTimeZone(state),
  selectedLog: buildLogDetail(state),
  tuples: getTuples(state),
  logs: getLogs(state),
  program: getPrevSearchProgram(state),
  space: getCurrentSpace(state)
})

export const XSearchResults = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchResults)
