/* @flow */

import React from "react"
import classNames from "classnames"

import {type State} from "../reducers/types"
import LoadingMessage from "./LoadingMessage"
import {XSearchStats} from "./SearchStats"

type StateProps = {|
  isFetching: boolean,
  isFetchingAhead: boolean
|}

type Props = {|...StateProps|}

export default class StatusBar extends React.Component<Props> {
  loadingMessage() {
    return this.props.isFetchingAhead ? "Loading More" : "Searching"
  }

  render() {
    return (
      <div
        className={classNames("status-bar", {loading: this.props.isFetching})}
      >
        <div className="status-bar-bg" />
        <div className="status-bar-content">
          <LoadingMessage
            show={this.props.isFetching}
            message={this.loadingMessage()}
          />
          <XSearchStats />
        </div>
      </div>
    )
  }
}

import {connect} from "react-redux"
import {getMainSearchIsFetching} from "../reducers/mainSearch"
import {isFetchingAhead} from "../reducers/logViewer"

const stateToProps = (state: State): StateProps => ({
  isFetching: getMainSearchIsFetching(state) || isFetchingAhead(state),
  isFetchingAhead: isFetchingAhead(state)
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
