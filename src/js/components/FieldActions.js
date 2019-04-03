/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {RightClickAction} from "../rightclick/actions"
import type {State} from "../reducers/types"
import {getViewerFieldActions} from "../selectors/fieldActions"
import Field from "../models/Field"
import Log from "../models/Log"
import RightClickMenu from "./RightClickMenu"

type OwnProps = {|
  log: Log,
  field: Field,
  onClose: Function,
  style: Object
|}

type StateProps = {|
  actions: RightClickAction[]
|}

type Props = {|
  ...OwnProps,
  ...StateProps
|}

export default class FieldActions extends React.Component<Props> {
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

export const XViewerFieldActions = connect<Props, OwnProps, _, _, _, _>(
  (state: State, props: OwnProps): StateProps => ({
    actions: getViewerFieldActions(state, props)
  })
)(FieldActions)
