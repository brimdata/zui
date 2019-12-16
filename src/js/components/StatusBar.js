/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {State} from "../state/types"
import {getViewerStatus} from "../state/viewer/selector"
import LoadingMessage from "./LoadingMessage"
import TableSearchStats from "./TableSearchStats"

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
  isFetching: getViewerStatus(state) === "FETCHING"
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
