/* @flow */

import React from "react"
import Field from "../models/Field"
import {ContextMenu, MenuItem} from "./ContextMenu"

type Props = {
  field: Field,
  appendQueryCountBy: Function,
  appendQueryExclude: Function,
  appendQueryInclude: Function,
  submitSearchBar: Function,
  onClose: Function,
  style: Object
}

export default class LogCellActions extends React.Component<Props> {
  include: Function
  exclude: Function
  countBy: Function

  constructor(props: Props) {
    super(props)
    this.include = this.include.bind(this)
    this.exclude = this.exclude.bind(this)
    this.countBy = this.countBy.bind(this)
  }

  include(e: Event) {
    e.stopPropagation()
    this.props.appendQueryInclude(
      this.props.field.name,
      escapeSpaces(this.props.field.value)
    )
    this.props.submitSearchBar()
  }

  exclude(e: Event) {
    e.stopPropagation()
    this.props.appendQueryExclude(
      this.props.field.name,
      escapeSpaces(this.props.field.value)
    )
    this.props.submitSearchBar()
  }

  countBy(e: Event) {
    e.stopPropagation()
    this.props.appendQueryCountBy(this.props.field.name)
    this.props.submitSearchBar()
  }

  render() {
    return (
      <ContextMenu onOutsideClick={this.props.onClose} style={this.props.style}>
        <MenuItem onClick={this.exclude}>Filter out these values</MenuItem>
        <MenuItem onClick={this.include}>Only show these values</MenuItem>
        <MenuItem onClick={this.countBy}>Count by this field</MenuItem>
      </ContextMenu>
    )
  }
}

const escapeSpaces = value => {
  if (/\s+/.test(value)) {
    return `"${value}"`
  } else {
    return value
  }
}
