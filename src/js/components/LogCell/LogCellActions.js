/* @flow */

import React from "react"
import Field from "../../models/Field"
import Log from "../../models/Log"
import buildMenu from "../LogCell/buildMenu"
import type {Space} from "../../lib/Space"
import type {MenuItemData} from "../LogCell/buildMenu"
import MenuList from "../MenuList"
import Portal from "../Portal"
import * as MenuStyler from "../../lib/MenuStyler"
import Measure from "react-measure"

export type Props = {
  field: Field,
  log: Log,
  style: Object,
  space: Space,
  onClose: Function,
  dispatch: Function
}

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
