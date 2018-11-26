/* @flow */

import React from "react"
import {XColResizer} from "./ColResizer"
import * as Styler from "./Styler"
import type {Layout} from "./Layout"
import FixedLayout from "./FixedLayout"

type Props = {
  layout: Layout,
  scrollLeft: number
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const {layout, scrollLeft} = this.props

    if (layout instanceof FixedLayout) {
      return (
        <header style={Styler.header(layout, scrollLeft)}>
          {layout.columns().map(col => (
            <div
              className="header-cell"
              key={col}
              style={Styler.cell(layout, col)}
            >
              {col}
              <XColResizer col={col} width={layout.cellWidth(col)} />
            </div>
          ))}
        </header>
      )
    } else {
      return null
    }
  }
}
