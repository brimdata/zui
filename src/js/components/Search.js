/* @flow */

import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import {XTitleBar} from "./TitleBar"
import {XControlBar} from "./ControlBar"
import {XHistogram} from "./Histogram"
import {XLeftPane} from "./LeftPane"
import {XRightPane} from "../components/RightPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XNotice} from "./Notice"
import * as searchPage from "../actions/searchPage"
import {XSearchResults} from "./SearchResults"
import ColumnChooser from "./ColumnChooser"
import {XWhoisModal} from "./WhoisModal"
import {XStatusBar} from "./StatusBar"
import {connect} from "react-redux"
import * as spaces from "../reducers/spaces"
import * as boomdConnection from "../reducers/boomdConnection"
import * as view from "../reducers/view"
import * as initialLoad from "../reducers/initialLoad"
import {type DispatchProps} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import {type State as S} from "../reducers/types"
import ErrorFactory from "../models/ErrorFactory"
import {AppError} from "../models/Errors"
import StartupError from "./StartupError"

type StateProps = {|
  isConnected: boolean,
  currentSpaceName: string,
  initialLoad: boolean,
  logsTab: boolean,
  space?: any
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

type State = {
  ready: boolean,
  error: ?AppError
}

export default class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {ready: false, error: null}
    props
      .dispatch(searchPage.init())
      .then(() => this.setState({ready: true}))
      .catch(e => this.setState({error: ErrorFactory.create(e)}))
  }

  render() {
    const {isConnected, currentSpaceName, logsTab} = this.props
    if (!isConnected) return <Redirect to="/connect" />
    if (this.state.error === "NoSpaces") return <Redirect to="/spaces" />
    if (this.state.error) {
      return <StartupError error={this.state.error} />
    }
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
              <ColumnChooser />
            </div>
            <XSearchResults />
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

const stateToProps = (state: S): StateProps => ({
  initialLoad: initialLoad.getInitialLoad(state),
  isConnected: boomdConnection.getBoomdIsConnected(state),
  currentSpaceName: spaces.getCurrentSpaceName(state),
  logsTab: view.getShowLogsTab(state),
  space: spaces.getCurrentSpace(state)
})

export const XSearch = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Search)
