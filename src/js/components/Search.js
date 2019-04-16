/* @flow */

import {AutoSizer} from "react-virtualized"
import {Redirect} from "react-router-dom"
import {connect} from "react-redux"
import React from "react"

import type {DispatchProps, State} from "../state/reducers/types"
import {NetworkError, UnauthorizedError} from "../models/Errors"
import {XControlBar} from "./ControlBar"
import {XDownloadProgress} from "./DownloadProgress"
import {XHistogram} from "./Histogram"
import {XLeftPane} from "./LeftPane"
import {XRightPane} from "./RightPane"
import {XSearchInspector} from "./SearchInspector"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XSettingsModal} from "./SettingsModal"
import {XStatusBar} from "./StatusBar"
import {XTitleBar} from "./TitleBar"
import {XWhoisModal} from "./WhoisModal"
import {getShowLogsTab} from "../state/reducers/view"
import {init} from "../state/actions/searchPage"
import AppError from "../models/AppError"
import ColumnChooser from "./ColumnChooser"
import ErrorFactory from "../models/ErrorFactory"
import StartupError from "./StartupError"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  logsTab: boolean
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

type LocalState = {
  ready: boolean,
  error: ?AppError
}

export default class Search extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props)
    this.state = {ready: false, error: null}
    props
      .dispatch(init())
      .then(() => this.setState({ready: true}))
      .catch((e) => this.setState({error: ErrorFactory.create(e)}))
  }

  render() {
    const {ready, error} = this.state
    if (error instanceof UnauthorizedError || error instanceof NetworkError)
      return <Redirect to="/connect " />
    if (error) return <StartupError error={error} />
    if (!ready) return null

    return (
      <div className="search-page-wrapper">
        <div className="search-page">
          <XLeftPane />
          <div className="search-page-main">
            <XTitleBar />
            <div className="search-page-header">
              <XControlBar />
              {this.props.logsTab && (
                <div className="search-page-header-charts">
                  <AutoSizer disableHeight>
                    {({width}) => <XHistogram height={80} width={width} />}
                  </AutoSizer>
                </div>
              )}
              <ColumnChooser />
            </div>
            <div className="search-results">
              <AutoSizer>
                {({height, width}) => (
                  <XSearchResults width={width} height={height} />
                )}
              </AutoSizer>
            </div>
            <XStatusBar />
          </div>
          <XRightPane />
        </div>
        <XSearchInspector />
        <XDownloadProgress />
        <XWhoisModal />
        <XSettingsModal />
      </div>
    )
  }
}

export const stateToProps = (state: State): StateProps => ({
  logsTab: getShowLogsTab(state)
})

export const XSearch = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Search)
