import React from "react"
import LogCell from "./LogCell"
import classNames from "classnames"

export default class LogRow extends React.PureComponent {
  fieldIndexes() {
    // Add tests
    const log = this.props.log
    let indexes = log.descriptor.map((d, i) => i)
    const tsIndex = log.getIndex("ts")
    indexes = indexes.filter(i => i !== tsIndex && i !== log.getIndex("_td"))
    indexes.unshift(tsIndex)
    return indexes
  }

  render() {
    const {log, style, highlight, index, isScrolling} = this.props
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={style}
      >
        {this.fieldIndexes().map(index => (
          <LogCell
            key={index}
            field={log.getFieldAt(index)}
            log={log}
            isScrolling={isScrolling}
          />
        ))}
      </div>
    )
  }
}
