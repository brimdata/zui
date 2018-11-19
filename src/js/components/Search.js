/* @flow */

import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import {XLogViewer} from "../components/LogViewer"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XSearchWelcome from "../connectors/XSearchWelcome"
import XAnalysisViewer from "../connectors/XAnalysisViewer"
import XLeftPane from "../connectors/XLeftPane"
import XRightPane from "../connectors/XRightPane"
import XDownloadProgress from "../connectors/XDownloadProgress"
import ViewerErrorBoundary from "./ViewerErrorBoundary"
import XNotice from "../connectors/XNotice"
import * as searchPage from "../actions/searchPage"

type Props = {
  dispatch: Function,
  fetchSpaceInfo: Function,
  isConnected: boolean,
  currentSpaceName: string,
  initialLoad: boolean,
  logsTab: boolean,
  analyticsTab: boolean,
  space?: any
}

type State = {
  ready: boolean,
  error: ?string
}

export default class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {ready: false, error: null}
    props
      .dispatch(searchPage.init())
      .then(() => this.setState({ready: true}))
      .catch(e => this.setState({error: e}))
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
    if (this.state.error === "NoSpaces") return <Redirect to="/spaces" />
    if (!this.state.ready) return null
    if (!currentSpaceName) return <Redirect to="/spaces" />

    return (
      <div className="search-page-wrapper">
        <XNotice />
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
              <ViewerErrorBoundary>
                {initialLoad && (
                  <XSearchWelcome currentSpaceName={currentSpaceName} />
                )}
                {!initialLoad &&
                  logsTab && (
                    <div className="log-viewer-wrapper">
                      <AutoSizer>
                        {({height, width}) => (
                          <XLogViewer height={height} width={width} />
                        )}
                      </AutoSizer>
                    </div>
                  )}

                {!initialLoad && analyticsTab && <XAnalysisViewer />}
              </ViewerErrorBoundary>
            </div>
            <div className="search-page-footer">
              <XSearchStats />
            </div>
          </div>
          <XRightPane />
        </div>
        <XDownloadProgress />
      </div>
    )
  }
}
