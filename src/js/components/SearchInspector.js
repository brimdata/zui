/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../state/types"
import {PaneTitle} from "./Pane"
import type {SearchesState} from "../state/searches/types"
import {getSearchInspectorIsOpen} from "../state/reducers/view"
import {getSearches} from "../state/searches/selector"
import {hideSearchInspector} from "../state/actions"
import {killSearch} from "../searches/cancelSearch"
import CloseButton from "./CloseButton"
import HorizontalTable from "./Tables/HorizontalTable"
import Log from "../models/Log"
import SearchStats from "../models/SearchStats"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  isOpen: boolean,
  searches: SearchesState,
  dispatch: Dispatch
}

export default function SearchInspector({dispatch, searches, isOpen}: Props) {
  if (!isOpen) return null

  let logs = toLogs(searches)

  function Actions({log}) {
    const onClick = () => dispatch(killSearch(log.get("name")))
    return <button onClick={onClick}>Kill</button>
  }

  return (
    <div className="search-inspector">
      <header>
        <PaneTitle>Search Inspector</PaneTitle>
        <CloseButton light onClick={() => dispatch(hideSearchInspector())} />
      </header>
      <section>
        {logs.length ? (
          <HorizontalTable
            descriptor={logs[0].descriptor}
            logs={logs}
            Actions={Actions}
          />
        ) : (
          <p className="empty">No searches to inspect.</p>
        )}
      </section>
    </div>
  )
}

function toLogs(searches) {
  const descriptor = [
    {name: "name", type: "string"},
    {name: "status", type: "string"},
    {name: "tag", type: "string"},
    {name: "elapsed", type: "interval"},
    {name: "bytes matched", type: "count"},
    {name: "bytes read", type: "count"},
    {name: "records matched", type: "count"},
    {name: "records read", type: "count"}
  ]

  let tuples = []

  for (let name in searches) {
    const search = searches[name]
    const stats = new SearchStats(search.stats)
    tuples.push([
      search.name,
      search.status,
      search.tag,
      stats.getElapsed(),
      stats.getBytesMatched(),
      stats.getBytesRead(),
      stats.getTuplesMatched(),
      stats.getTuplesRead()
    ])
  }

  return Log.build({descriptor, tuples})
}

const stateToProps = (state: State) => ({
  isOpen: getSearchInspectorIsOpen(state),
  searches: getSearches(state)
})

export const XSearchInspector = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchInspector)
