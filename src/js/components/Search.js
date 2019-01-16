/* @flow */

import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import {XTitleBar} from "./TitleBar"
import {XControlBar} from "./ControlBar"
import {XHistogram} from "./Histogram"
import XLeftPane from "../connectors/XLeftPane"
import {XRightPane} from "../components/RightPane"
import XDownloadProgress from "../connectors/XDownloadProgress"
import XNotice from "../connectors/XNotice"
import * as searchPage from "../actions/searchPage"
import {XSearchResults} from "./SearchResults"
import {XColumnChooser} from "./ColumnChooser"
import {XWhoisModal} from "./WhoisModal"
import {XStatusBar} from "./StatusBar"

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
    if (this.state.error) throw new Error(this.state.error)
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
                    {({width}) => <XHistogram height={80} width={width} />}
                  </AutoSizer>
                </div>
              )}
              <XColumnChooser />
            </div>
            <XSearchResults logsTab={logsTab} analyticsTab={analyticsTab} />
            <XStatusBar />
          </div>
          <XRightPane />
        </div>
        <XDownloadProgress />
        <XWhoisModal />
      </div>
    )
  }
}

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as spaceActions from "../actions/spaces"
import * as viewActions from "../actions/view"
import * as spaces from "../reducers/spaces"
import * as boomdConnection from "../reducers/boomdConnection"
import * as view from "../reducers/view"
import * as initialLoad from "../reducers/initialLoad"

const stateToProps = state => ({
  initialLoad: initialLoad.getInitialLoad(state),
  isConnected: boomdConnection.getBoomdIsConnected(state),
  currentSpaceName: spaces.getCurrentSpaceName(state),
  logsTab: view.getShowLogsTab(state),
  analyticsTab: view.getShowAnalyticsTab(state),
  space: spaces.getCurrentSpace(state)
})

export const XSearch = connect(
  stateToProps,
  (dispatch: Function) => ({
    ...bindActionCreators(
      {...spaceActions, ...viewActions, dispatch},
      dispatch
    ),
    dispatch
  })
)(Search)
