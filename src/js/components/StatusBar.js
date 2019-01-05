/* @flow */

import React from "react"
import XSearchStats from "../connectors/XSearchStats"
import classNames from "classnames"

type Props = {
  isFetching: boolean
}

export default class StatusBar extends React.Component<Props> {
  render() {
    return (
      <div className="status-bar">
        <div
          className={classNames("loading-animation", {
            visible: this.props.isFetching
          })}
        >
          <div className="ring-1" />
          <div className="ring-2" />
        </div>

        <XSearchStats />
      </div>
    )
  }
}

import {connect} from "react-redux"
import {getMainSearchIsFetching} from "../reducers/mainSearch"
import {isFetchingAhead} from "../reducers/logViewer"

const stateToProps = state => ({
  isFetching: getMainSearchIsFetching(state) || isFetchingAhead(state)
})

export const XStatusBar = connect(stateToProps)(StatusBar)
