/* @flow */

import {connect} from "react-redux"
import Measure from "react-measure"
import React from "react"

import type {DispatchProps, State} from "../../reducers/types"
import type {MenuItemData} from "./rightClick"
import {type ResultsTabEnum, getResultsTab} from "../../reducers/view"
import type {Space} from "../../lib/Space"
import Field from "../../models/Field"
import Log from "../../models/Log"
import MenuList from "../MenuList"
import * as MenuStyler from "../../lib/MenuStyler"
import Portal from "../Portal"
import buildMenu from "./buildMenu"
import dispatchToProps from "../../lib/dispatchToProps"
import * as spaces from "../../reducers/spaces"

type OwnProps = {|
  log: Log,
  field: Field,
  onClose: Function,
  style: Object
|}

type StateProps = {|
  space: Space,
  resultType: ResultsTabEnum,
  menuActions: MenuItemData[]
|}

type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

export default class LogCellActions extends React.Component<Props> {
  renderItem = (item: MenuItemData, index: number) => {
    switch (item.type) {
      case "action":
        return (
          <li
            key={index}
            onClick={item.onClick.bind(null, this.props.dispatch)}
          >
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
                {this.props.menuActions.map(this.renderItem)}
              </MenuList>
            </Portal>
          )
        }}
      </Measure>
    )
  }
}

const stateToProps = (state: State, props: OwnProps): StateProps => ({
  menuActions: buildMenu(state, props),
  space: spaces.getCurrentSpace(state),
  resultType: getResultsTab(state)
})

export const XLogCellActions = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LogCellActions)
