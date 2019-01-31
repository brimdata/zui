/* @flow */

import React from "react"
import CircleChevron from "./CircleChevron"
import classNames from "classnames"
import type {Dispatch} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import {hideRightSidebar} from "../actions/view"
import {connect} from "react-redux"

type Props = {
  show: boolean,
  dispatch: Dispatch
}

type OwnProps = {
  show: boolean
}

export default class RightPaneCollapser extends React.Component<Props> {
  onClick = () => {
    this.props.dispatch(hideRightSidebar())
  }

  render() {
    const {show} = this.props
    return (
      <div
        className={classNames("right-pane-collapser", {show})}
        onClick={this.onClick}
      >
        <CircleChevron collapse right light />
      </div>
    )
  }
}

export const XRightPaneCollapser = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(RightPaneCollapser)
