/* @flow */

import React from "react"
import classNames from "classnames"

import {type State} from "../reducers/types"
import LoadingMessage from "./LoadingMessage"
import XSearchStats from "../connectors/XSearchStats"

type StateProps = {|
  isFetching: boolean
|}

type Props = {|...StateProps|}

export default class StatusBar extends React.Component<Props> {
  render() {
    return (
      <div
        className={classNames("status-bar", {loading: this.props.isFetching})}
      >
        <LoadingMessage show={this.props.isFetching} message="Searching..." />
        <XSearchStats />
      </div>
    )
  }
}

import {connect} from "react-redux"
import {getMainSearchIsFetching} from "../reducers/mainSearch"
import {isFetchingAhead} from "../reducers/logViewer"

const stateToProps = (state: State): StateProps => ({
  isFetching: getMainSearchIsFetching(state) || isFetchingAhead(state)
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
