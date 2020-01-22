/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {State} from "../state/types"
import LoadingMessage from "./LoadingMessage"
import TableSearchStats from "./TableSearchStats"
import Viewer from "../state/Viewer"

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
          <TableSearchStats />
        </div>
      </div>
    )
  }
}

const stateToProps = (state: State): StateProps => ({
  isFetching: Viewer.getStatus(state) === "FETCHING"
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
