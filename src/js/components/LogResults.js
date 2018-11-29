/* @flow */

import React from "react"
import {AutoSizer} from "react-virtualized"
import {XLogViewer} from "../components/LogViewer"
import NoResults from "./NoResults"

type Props = {
  hasData: boolean,
  isComplete: boolean,
  dispatch: Function
}

export default class LogResults extends React.Component<Props> {
  render() {
    if (!this.props.hasData && this.props.isComplete) return <NoResults />
    if (!this.props.hasData) return null

    return (
      <div className="log-results">
        <div className="log-viewer-wrapper">
          <AutoSizer>
            {({height, width}) => <XLogViewer height={height} width={width} />}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as mainSearch from "../reducers/mainSearch"

const stateToProps = state => ({
  hasData: mainSearch.getMainSearchEvents(state).length > 0,
  isComplete: mainSearch.getMainSearchIsComplete(state)
})

export const XLogResults = connect(stateToProps)(LogResults)
