/* @flow */

import React from "react"
import Field from "../models/Field"
import {ContextMenu, MenuItem} from "./ContextMenu"
import * as searchBar from "../actions/searchBar"

type Props = {
  field: Field,
  style: Object,
  onClose: Function,
  dispatch: Function
}

export default class LogCellActions extends React.Component<Props> {
  include: Function
  exclude: Function
  countBy: Function
  menuItems: {text: string, onClick: Function}[]

  constructor(props: Props) {
    super(props)
    const {dispatch, field} = props

    this.menuItems = [
      {
        text: "Filter out these values",
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryExclude(field))
          dispatch(searchBar.submitSearchBar())
        }
      },
      {
        text: "Only show these values",
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryInclude(field))
          dispatch(searchBar.submitSearchBar())
        }
      },
      {
        text: "Count by this field",
        onClick: (e: Event) => {
          e.stopPropagation()
          dispatch(searchBar.appendQueryCountBy(field))
          dispatch(searchBar.submitSearchBar())
        }
      }
    ]
  }

  render() {
    return (
      <ContextMenu onOutsideClick={this.props.onClose} style={this.props.style}>
        {this.menuItems.map(item => (
          <MenuItem key={item.text} onClick={item.onClick}>
            {item.text}
          </MenuItem>
        ))}
      </ContextMenu>
    )
  }
}
