/* @flow */

import React from "react"
import Field from "../models/Field"
import Log from "../models/Log"
import {ContextMenu, MenuItem} from "./ContextMenu"
import * as searchBar from "../actions/searchBar"
import * as packets from "../actions/packets"
import type {Space} from "../lib/Space"

type Props = {
  field: Field,
  log: Log,
  style: Object,
  space: Space,
  onClose: Function,
  dispatch: Function
}

type Action = {
  type: "action",
  text: string,
  onClick: Event => void
}

type Seperator = {
  type: "seperator"
}

type MenuItemData = Seperator | Action

export default class LogCellActions extends React.Component<Props> {
  menu: MenuItemData[]

  constructor(props: Props) {
    super(props)
    const {dispatch, field, log, space} = props

    this.menu = [
      {
        type: "action",
        text: "Filter out these values",
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryExclude(field))
          dispatch(searchBar.submitSearchBar())
        }
      },
      {
        type: "action",
        text: "Only show these values",
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryInclude(field))
          dispatch(searchBar.submitSearchBar())
        }
      },
      {
        type: "action",
        text: `Count by ${field.name}`,
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryCountBy(field))
          dispatch(searchBar.submitSearchBar())
        }
      }
    ]

    if (log.isPath("conn") && space.packet_support) {
      this.menu = this.menu.concat([
        {
          type: "seperator"
        },
        {
          type: "action",
          text: "Download PCAPS",
          onClick: (_e: Event) => {
            dispatch(packets.fetchPackets(log))
          }
        }
      ])
    }
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
