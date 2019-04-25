/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {State} from "../state/types"
import {XSearchStats} from "./SearchStats"
import {getSearchStatus} from "../state/searches/selector"
import LoadingMessage from "./LoadingMessage"

type StateProps = {|
  isFetching: boolean
|}

type Props = {|...StateProps|}

export default class StatusBar extends React.Component<Props> {
  loadingMessage() {
    return "Searching"
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

const stateToProps = (state: State): StateProps => ({
  isFetching: getSearchStatus(state, "ViewerSearch") === "FETCHING"
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
