/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../reducers/types"
import {PaneTitle} from "./Pane"
import {getBoomSearchesAsLogs} from "../selectors/boomSearches"
import {getSearchInspectorIsOpen} from "../reducers/view"
import {hideSearchInspector} from "../actions/view"
import CloseButton from "./CloseButton"
import HorizontalTable from "./Tables/HorizontalTable"
import Log from "../models/Log"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  isOpen: boolean,
  logs: Log[],
  dispatch: Dispatch
}

export default function SearchInspector({dispatch, logs, isOpen}: Props) {
  // const actions = [
  // {
  // text: "Kill",
  // click: (log: Log) => dispatch(killBoomSearch(log.get("name")))
  // }
  // ]

  function onClose() {
    dispatch(hideSearchInspector())
  }

  if (!isOpen) return null

  const data = logs.map(log => log.getFields().map(f => ({...f})))
  console.log(data)
  return (
    <div className="search-inspector">
      <header>
        <PaneTitle>Search Inspector</PaneTitle>
        <CloseButton light onClick={onClose} />
      </header>
      <section>
        <HorizontalTable headers={logs[0].descriptor} data={data} />
      </section>
    </div>
  )
}

const stateToProps = (state: State) => ({
  isOpen: getSearchInspectorIsOpen(state),
  logs: getBoomSearchesAsLogs(state)
})

export const XSearchInspector = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchInspector)
