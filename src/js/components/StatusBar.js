/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import {type State} from "../state/reducers/types"
import {XSearchStats} from "./SearchStats"
import {getSearchStatus} from "../state/searches/selector"
import {isFetchingAhead} from "../state/reducers/logViewer"
import LoadingMessage from "./LoadingMessage"

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

const stateToProps = (state: State): StateProps => ({
  isFetching: getSearchStatus(state, "ViewerSearch") === "FETCHING",
  isFetchingAhead: isFetchingAhead(state)
})

export const XStatusBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  StatusBar
)
