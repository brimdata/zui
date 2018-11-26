/* @flow */

import React from "react"
import {AutoSizer} from "react-virtualized"
import {XLogViewer} from "../components/LogViewer"

type Props = {
  hasData: boolean
}

export default class LogResults extends React.Component<Props> {
  render() {
    if (!this.props.hasData) return null

    return (
      <div className="log-viewer-wrapper">
        <AutoSizer>
          {({height, width}) => <XLogViewer height={height} width={width} />}
        </AutoSizer>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as mainSearch from "../reducers/mainSearch"

const stateToProps = state => ({
  hasData: mainSearch.getMainSearchEvents(state).length > 0
})

export const XLogResults = connect(stateToProps)(LogResults)
