import React from "react"
import Cell from "./Cell"
import {XColResizer} from "./ColResizer"
import * as Styler from "./Styler"

export default class Header extends React.PureComponent {
  render() {
    const {layout, scrollLeft} = this.props

    if (!layout.showHeader()) return null
    return (
      <header style={Styler.header(layout, scrollLeft)}>
        {layout.columns().map(col => (
          <Cell key={col} style={Styler.cell(layout, col)}>
            {col}
            <XColResizer col={col} width={layout.cellWidth(col)} />
          </Cell>
        ))}
      </header>
    )
  }
}
