/* @flow */

import React from "react"
import ViewerErrorBoundary from "./ViewerErrorBoundary"

import XAnalysisViewer from "../connectors/XAnalysisViewer"
import {XLogResults} from "./LogResults"
import type {ResultsTabEnum} from "../reducers/view"

type Props = {
  tab: ResultsTabEnum
}

export default class SearchResults extends React.Component<Props> {
  chooseTab() {
    switch (this.props.tab) {
      case "analytics":
        return <XAnalysisViewer />
      case "logs":
        return
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-results">
        <ViewerErrorBoundary>{<XLogResults />}</ViewerErrorBoundary>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as view from "../reducers/view"

const stateToProps = state => ({
  tab: view.getResultsTab(state)
})

export const XSearchResults = connect(stateToProps)(SearchResults)
