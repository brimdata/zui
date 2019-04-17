/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {Dispatch} from "../state/reducers/types"
import {hideRightSidebar} from "../state/actions"
import CircleChevron from "./CircleChevron"
import dispatchToProps from "../lib/dispatchToProps"

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
