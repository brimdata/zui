import React from "react"
import LogCell from "./LogCell"
import classNames from "classnames"
import * as Styler from "./Viewer/Styler"

export default class LogRow extends React.PureComponent {
  renderAutoLayout() {
    const {dimens, highlight, index, log} = this.props
    const columns = log.descriptor
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(dimens)}
        onClick={this.props.onClick}
      >
        {columns.map((column, colIndex) => (
          <LogCell
            key={`${index}-${colIndex}`}
            field={log.getField(column.name)}
            log={log}
            style={{width: "auto"}}
          />
        ))}
      </div>
    )
  }

  renderFixedLayout() {
    const {highlight, columns, log, dimens, index} = this.props
    const renderCell = (column, colIndex) => {
      const field = log.getField(column.name)
      const style = {width: column.width || 300}
      const key = `${index}-${colIndex}`

      if (field) {
        return (
          <LogCell
            key={key}
            field={log.getField(column.name)}
            log={log}
            style={style}
          />
        )
      } else {
        return (
          <div className="log-cell" key={key} style={{width: column.width}} />
        )
      }
    }

    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(dimens)}
        onClick={this.props.onClick}
      >
        {columns.filter(c => c.isVisible).map(renderCell)}
      </div>
    )
  }

  render() {
    return this.props.dimens.rowWidth !== "auto"
      ? this.renderFixedLayout()
      : this.renderAutoLayout()
  }
}
