/* @flow */

import React from "react"
import Field from "../../models/Field"
import Log from "../../models/Log"
import {ContextMenu, MenuItem} from "../ContextMenu"
import buildMenu from "../LogCell/buildMenu"
import type {Space} from "../../lib/Space"
import type {MenuItemData} from "../LogCell/buildMenu"

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
          <MenuItem key={index} onClick={item.onClick}>
            {item.text}
          </MenuItem>
        )
      case "seperator":
        return <hr key={index} />
    }
  }

  render() {
    return (
      <ContextMenu onOutsideClick={this.props.onClose} style={this.props.style}>
        {this.menu.map(this.renderItem)}
      </ContextMenu>
    )
  }
}
