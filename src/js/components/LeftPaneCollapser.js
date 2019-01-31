/* @flow */

import React from "react"
import CircleChevron from "./CircleChevron"
import classNames from "classnames"
import type {Dispatch} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import {connect} from "react-redux"
import {hideLeftSidebar} from "../actions/view"

type Props = {
  show: boolean,
  dispatch: Dispatch
}

type OwnProps = {
  show: boolean
}

export default class LeftPaneCollapser extends React.Component<Props> {
  onClick = () => {
    this.props.dispatch(hideLeftSidebar())
  }

  render() {
    const {show} = this.props
    return (
      <div
        className={classNames("left-pane-collapser", {show})}
        onClick={this.onClick}
      >
        <CircleChevron collapse left dark />
      </div>
    )
  }
}

export const XLeftPaneCollapser = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(LeftPaneCollapser)
