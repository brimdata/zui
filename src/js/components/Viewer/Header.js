import React from "react"
import Cell from "./Cell"
import ColResizer from "./ColResizer"
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
            <ColResizer col={col} width={layout.cellWidth(col)} />
          </Cell>
        ))}
      </header>
    )
  }
}
