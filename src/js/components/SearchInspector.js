/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../state/reducers/types"
import {PaneTitle} from "./Pane"
import {getBoomSearchesAsLogs} from "../state/selectors/boomSearches"
import {getSearchInspectorIsOpen} from "../state/reducers/view"
import {hideSearchInspector} from "../state/actions"
import {killBoomSearch} from "../state/thunks/boomSearches"
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

  function Actions({log}) {
    const onClick = () => dispatch(killBoomSearch(log.get("name")))
    return <button onClick={onClick}>Kill</button>
  }

  return (
    <div className="search-inspector">
      <header>
        <PaneTitle>Search Inspector</PaneTitle>
        <CloseButton light onClick={() => dispatch(hideSearchInspector())} />
      </header>
      <section>
        <HorizontalTable
          descriptor={logs[0].descriptor}
          logs={logs}
          Actions={Actions}
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
