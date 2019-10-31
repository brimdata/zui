/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch} from "../state/types"
import type {RightClickAction} from "../rightclick/actions"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  action: RightClickAction,
  dispatch: Dispatch
}

type OwnProps = {
  action: RightClickAction
}

const RightClickMenuItem = (props: Props) => {
  const action = props.action

  switch (action.type) {
    case "separator":
      return <hr />
    default:
      return <li onClick={action.click}>{action.label}</li>
  }
}

export const XRightClickMenuItem = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(RightClickMenuItem)

export default RightClickMenuItem
