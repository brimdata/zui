/* @flow */

import React from "react"
import ViewerErrorBoundary from "./ViewerErrorBoundary"

import {XLogResults} from "./LogResults"
import type {ResultsTabEnum} from "../reducers/view"
import type {State} from "../reducers/types"

type StateProps = {|
  tab: ResultsTabEnum
|}

type Props = {|...StateProps|}

export default class SearchResults extends React.Component<Props> {
  render() {
    return (
      <div className="search-results">
        <ViewerErrorBoundary>
          <XLogResults />
        </ViewerErrorBoundary>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as view from "../reducers/view"

const stateToProps = (state: State) => ({
  tab: view.getResultsTab(state)
})

export const XSearchResults = connect<Props, {||}, _, _, _, _>(stateToProps)(
  SearchResults
)
