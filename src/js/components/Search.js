/* @flow */

import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XLeftPane from "../connectors/XLeftPane"
import XRightPane from "../connectors/XRightPane"
import XDownloadProgress from "../connectors/XDownloadProgress"
import XNotice from "../connectors/XNotice"
import * as searchPage from "../actions/searchPage"
import {XSearchResults} from "./SearchResults"

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
    const {isConnected, currentSpaceName, logsTab, analyticsTab} = this.props

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
              {logsTab && (
                <div className="search-page-header-charts">
                  <AutoSizer disableHeight>
                    {({width}) => <XCountByTime height={80} width={width} />}
                  </AutoSizer>
                </div>
              )}
            </div>
            <XSearchResults logsTab={logsTab} analyticsTab={analyticsTab} />
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
