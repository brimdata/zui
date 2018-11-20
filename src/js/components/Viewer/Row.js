import React from "react"
import * as Styler from "./Styler"
import LogCell from "../LogCell"
import classNames from "classnames"

export default class Row extends React.PureComponent {
  render() {
    const {index, data, layout, hightlight} = this.props
    const log = data[index]

    return (
      <div
        className={classNames("row", {hightlight, even: index % 2 == 0})}
        style={Styler.row(layout, index)}
      >
        {this.getCols().map((col, i) => (
          <LogCell
            key={i}
            field={log.getField(col)}
            log={log}
            isScrolling={false}
            style={Styler.cell(layout, col)}
          />
        ))}
      </div>
    )
  }

  getCols() {
    if (this.props.layout.cols) {
      return this.props.layout.cols
    } else {
      const cols = this.props.log.descriptor
        .map(d => d.name)
        .filter(col => col !== "ts" && col !== "_td")
        .unshift("ts")
      return cols
    }
  }
}
