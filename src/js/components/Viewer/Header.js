/* @flow */

import React from "react"

import type {Layout} from "./Layout"
import type {TableColumn} from "../../types"
import {XColResizer} from "./ColResizer"
import FixedLayout from "./FixedLayout"
import * as Styler from "./Styler"
import columnKey from "../../lib/columnKey"

type Props = {
  layout: Layout,
  scrollLeft: number,
  columns: TableColumn[]
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const {layout, scrollLeft} = this.props

    if (layout instanceof FixedLayout) {
      return (
        <header style={Styler.header(layout, scrollLeft)}>
          {this.props.columns
            .filter(c => c.isVisible)
            .map(column => (
              <div
                className="header-cell"
                key={columnKey(column)}
                style={{width: column.width || 300}}
              >
                {column.name}
                <XColResizer
                  column={column}
                  tableId={this.props.layout.columns.id}
                />
              </div>
            ))}
        </header>
      )
    } else {
      return null
    }
  }
}
