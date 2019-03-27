/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../reducers/types"
import {PaneTitle} from "./Pane"
import {getBoomSearchesAsLogs} from "../selectors/boomSearches"
import {getSearchInspectorIsOpen} from "../reducers/view"
import {hideSearchInspector} from "../actions/view"
import {killBoomSearch} from "../actions/boomSearches"
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
  if (!isOpen) return null

  const data = logs.map(log => log.getFields().map(f => ({...f})))

  function Actions({row}) {
    const nameCell = row.find(cell => cell.name === "name")

    return (
      <button onClick={() => dispatch(killBoomSearch(nameCell.value))}>
        Kill
      </button>
    )
  }

  return (
    <div className="search-inspector">
      <header>
        <PaneTitle>Search Inspector</PaneTitle>
        <CloseButton light onClick={() => dispatch(hideSearchInspector())} />
      </header>
      <section>
        <HorizontalTable
          headers={logs[0].descriptor}
          data={data}
          actions={Actions}
        />
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
