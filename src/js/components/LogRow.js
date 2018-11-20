import React from "react"
import LogCell from "./LogCell"
import classNames from "classnames"
import * as Styler from "./Viewer/Styler"

export default class LogRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.renderCell = this.renderCell.bind(this)
  }

  renderCell(col) {
    const {log, layout, index, isScrolling} = this.props
    const field = log.getField(col)
    const style = Styler.cell(layout, col)
    const key = `${index}-${col}`
    if (field) {
      return (
        <LogCell
          key={key}
          field={log.getField(col)}
          log={log}
          isScrolling={isScrolling}
          style={style}
        />
      )
    } else {
      return <div className="log-cell" key={key} style={style} />
    }
  }

  render() {
    const {log, layout, highlight, index} = this.props
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(layout, index)}
      >
        {layout.columns(log).map(this.renderCell)}
      </div>
    )
  }
}
