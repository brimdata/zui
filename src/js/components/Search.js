/* @flow */

import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XLogViewer from "../connectors/XLogViewer"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XSearchWelcome from "../connectors/XSearchWelcome"
import XAnalysisViewer from "../connectors/XAnalysisViewer"
import XLeftPane from "../connectors/XLeftPane"
import XRightPane from "../connectors/XRightPane"

type Props = {
  fetchAllSpaces: Function,
  isConnected: boolean,
  currentSpaceName: string,
  initialLoad: boolean,
  logsTab: boolean,
  analyticsTab: boolean
}

export default class Search extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllSpaces()
  }

  render() {
    const {
      isConnected,
      currentSpaceName,
      initialLoad,
      logsTab,
      analyticsTab
    } = this.props

    if (!isConnected) return <Redirect to="/connect" />
    if (!currentSpaceName) return <Redirect to="/spaces" />

    return (
      <div className="search-page">
        <XLeftPane />
        <div className="search-page-main">
          <XTitleBar />
          <div className="search-page-header">
            <XControlBar />
            {!initialLoad &&
              logsTab && (
                <div className="search-page-header-charts">
                  <AutoSizer disableHeight>
                    {({width}) => <XCountByTime height={80} width={width} />}
                  </AutoSizer>
                </div>
              )}
          </div>
          <div className="search-page-body">
            {initialLoad && (
              <XSearchWelcome currentSpaceName={currentSpaceName} />
            )}
            {!initialLoad && logsTab && <XLogViewer />}
            {!initialLoad && analyticsTab && <XAnalysisViewer />}
          </div>
          <div className="search-page-footer">
            <XSearchStats />
          </div>
        </div>
        <XRightPane />
      </div>
    )
  }
}
