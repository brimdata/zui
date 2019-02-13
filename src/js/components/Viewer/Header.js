/* @flow */

import React from "react"

import type {Layout} from "./Layout"
import {XColResizer} from "./ColResizer"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"

type Props = {
  layout: Layout,
  scrollLeft: number,
  columns: TableColumns
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const {layout, scrollLeft} = this.props

    if (layout.rowWidth !== "auto") {
      return (
        <header style={Styler.header(layout, scrollLeft)}>
          {this.props.columns.getVisible().map(column => (
            <div
              className="header-cell"
              key={columnKey(column)}
              style={{width: column.width || 300}}
            >
              {column.name}
              <XColResizer column={column} tableId={this.props.columns.id} />
            </div>
          ))}
        </header>
      )
    } else {
      return null
    }
  }
}
