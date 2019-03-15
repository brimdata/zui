/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {MenuItemData} from "./LogCell/rightClick"
import type {State} from "../reducers/types"
import Field from "../models/Field"
import Log from "../models/Log"
import RightClickMenu from "./RightClickMenu"
import buildMenu from "./LogCell/buildMenu"

type OwnProps = {|
  log: Log,
  field: Field,
  onClose: Function,
  style: Object
|}

type StateProps = {|
  actions: MenuItemData[]
|}

type Props = {|
  ...OwnProps,
  ...StateProps
|}

export default class ViewerFieldActions extends React.Component<Props> {
  render() {
    return (
      <RightClickMenu
        actions={this.props.actions}
        onClose={this.props.onClose}
        style={this.props.style}
      />
    )
  }
}

const stateToProps = (state: State, props: OwnProps): StateProps => ({
  actions: buildMenu(state, props)
})

export const XViewerFieldActions = connect<Props, OwnProps, _, _, _, _>(
  stateToProps
)(ViewerFieldActions)
