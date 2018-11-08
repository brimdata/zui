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
import XDownloadProgress from "../connectors/XDownloadProgress"
import ViewerErrorBoundary from "./ViewerErrorBoundary"
import XNotice from "../connectors/XNotice"
import * as searchBar from "../actions/searchBar"
import * as mainSearch from "../actions/mainSearch"
import * as countByTime from "../actions/countByTime"
import * as timeWindow from "../actions/timeWindow"

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
  ready: boolean
}

export default class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {ready: false}
    props.fetchSpaceInfo(this.props.currentSpaceName).done(() => {
      props.dispatch(timeWindow.init())
      props.dispatch(searchBar.submitSearchBar())
      this.setState({ready: true})
    })
  }

  componentWillUnmount() {
    this.props.dispatch(mainSearch.reset())
    this.props.dispatch(countByTime.reset())
    this.props.dispatch(timeWindow.reset())
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

    if (!this.state.ready) return null

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
                {!initialLoad && logsTab && <XLogViewer />}
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
