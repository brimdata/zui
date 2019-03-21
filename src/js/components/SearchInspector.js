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
import InlineTable from "./InlineTable"
import Log from "../models/Log"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  isOpen: boolean,
  logs: Log[],
  dispatch: Dispatch
}

export default class SearchInspector extends React.Component<Props> {
  onClose = () => this.props.dispatch(hideSearchInspector())

  getActions = () => {
    return [
      {
        text: "Kill",
        click: (log: Log) =>
          this.props.dispatch(killBoomSearch(log.get("name")))
      }
    ]
  }

  render() {
    if (!this.props.isOpen) return null

    return (
      <div className="search-inspector">
        <header>
          <PaneTitle>Search Inspector</PaneTitle>
          <CloseButton light onClick={this.onClose} />
        </header>
        <section>
          <InlineTable logs={this.props.logs} actions={this.getActions()} />
        </section>
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  isOpen: getSearchInspectorIsOpen(state),
  logs: getBoomSearchesAsLogs(state)
})

export const XSearchInspector = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchInspector)
