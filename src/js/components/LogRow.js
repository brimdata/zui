import React from "react"
import LogCell from "./LogCell"
import classNames from "classnames"
import * as Styler from "./Viewer/Styler"
import FixedLayout from "./Viewer/FixedLayout"

export default class LogRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.renderCell = this.renderCell.bind(this)
  }

  renderCell({name: col}, colIndex) {
    const {log, layout, index} = this.props
    const field = log.getField(col)
    const style = Styler.cell(layout, col)
    const key = `${index}-${colIndex}`
    if (field) {
      return (
        <LogCell key={key} field={log.getField(col)} log={log} style={style} />
      )
    } else if (layout instanceof FixedLayout) {
      return <div className="log-cell" key={key} style={style} />
    }
  }

  render() {
    const {layout, highlight, index} = this.props
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(layout, index)}
        onClick={this.props.onClick}
      >
        {layout.visibleColumns().map(this.renderCell)}
      </div>
    )
  }
}
