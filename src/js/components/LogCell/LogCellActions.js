/* @flow */

import React from "react"
import Field from "../../models/Field"
import Log from "../../models/Log"
import buildMenu from "../LogCell/buildMenu"
import type {Space} from "../../lib/Space"
import type {MenuItemData} from "../LogCell/buildMenu"
import MenuList from "../MenuList"
import Portal from "../Portal"

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
      <Portal
        isOpen={true}
        onClose={this.props.onClose}
        style={this.props.style}
      >
        <MenuList>{this.menu.map(this.renderItem)}</MenuList>
      </Portal>
    )
  }
}
