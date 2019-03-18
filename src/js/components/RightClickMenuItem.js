/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch} from "../reducers/types"
import type {MenuItemData} from "./FieldActionData"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  action: MenuItemData,
  dispatch: Dispatch
}

type OwnProps = {
  action: MenuItemData
}

const RightClickMenuItem = (props: Props) => {
  const action = props.action

  switch (action.type) {
    case "action":
      return (
        <li onClick={action.onClick.bind(null, props.dispatch)}>
          {action.text}
        </li>
      )
    case "seperator":
      return <hr />
    default:
      throw "Unknown Action"
  }
}

export const XRightClickMenuItem = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(RightClickMenuItem)

export default RightClickMenuItem
