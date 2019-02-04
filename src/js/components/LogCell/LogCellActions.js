/* @flow */

import React from "react"
import Field from "../../models/Field"
import Log from "../../models/Log"
import buildMenu from "../../lib/buildMenu"
import type {Space} from "../../lib/Space"
import type {MenuItemData} from "../../actions/rightClick"
import MenuList from "../MenuList"
import Portal from "../Portal"
import * as MenuStyler from "../../lib/MenuStyler"
import Measure from "react-measure"
import {connect} from "react-redux"
import * as spaces from "../../reducers/spaces"
import type {State} from "../../reducers/types"
import {type DispatchProps} from "../../reducers/types"
import dispatchToProps from "../../lib/dispatchToProps"
import {getResultsTab} from "../../reducers/view"
import type {ResultsTabEnum} from "../../reducers/view"

type OwnProps = {|
  log: Log,
  field: Field,
  onClose: Function,
  style: Object
|}

type StateProps = {|
  space: Space,
  resultType: ResultsTabEnum
|}

type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

export default class LogCellActions extends React.Component<Props> {
  menu: MenuItemData[]

  constructor(props: Props) {
    super(props)
    this.menu = buildMenu(props)
  }

  renderItem(item: MenuItemData, index: number) {
    switch (item.type) {
      case "action":
        return (
          <li key={index} onClick={item.onClick}>
            {item.text}
          </li>
        )
      case "seperator":
        return <hr key={index} />
    }
  }

  render() {
    return (
      <Measure bounds>
        {({measureRef, contentRect}) => {
          return (
            <Portal
              isOpen={true}
              onClose={this.props.onClose}
              style={MenuStyler.ensureVisible(
                contentRect.bounds,
                this.props.style
              )}
            >
              <MenuList ref={measureRef}>
                {this.menu.map(this.renderItem)}
              </MenuList>
            </Portal>
          )
        }}
      </Measure>
    )
  }
}

const stateToProps = (state: State): StateProps => ({
  space: spaces.getCurrentSpace(state),
  resultType: getResultsTab(state)
})

export const XLogCellActions = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LogCellActions)
