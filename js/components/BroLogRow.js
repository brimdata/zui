import React from "react"
import difference from "lodash/difference"
import XBroLogDetail from "../connectors/XBroLogDetail"
import DownArrow from "../icons/chevron-bottom-md.svg"
import TableCell from "./TableCell"
import classNames from "classnames"

const defaultFields = ["uid", "ts", "fuid", "_td"]

export const ScrollingRow = ({broLog, style}) => {
  const fields = difference(broLog.fieldNames(), defaultFields)

  return (
    <div className="bro-log-row-wrapper" style={style}>
      <div className="bro-log-row">
        <div className="expand-button" />
        <div className="mini-ts">
          <p>{broLog.cast("ts").format(":ss")}</p>
        </div>
        {fields.map(name => (
          <ScrollingCell key={name} field={broLog.getField(name)} />
        ))}
      </div>
    </div>
  )
}

const ScrollingCell = ({field}) => {
  return (
    <div className={`cell ${field.type} ${field.name}`}>
      <p
        className={classNames({
          [`${field.value}-bg-color`]: field.name === "_path"
        })}
      >
        {field.toString()}
      </p>
    </div>
  )
}

export default class BroLogRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {expanded: false}
    this.showDetails = () => {
      this.setState({expanded: !this.state.expanded})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded !== this.state.expanded) {
      this.props.onToggle()
    }
  }

  render() {
    const {broLog} = this.props
    const fields = difference(broLog.fieldNames(), defaultFields)

    return (
      <div
        className={classNames({
          "bro-log-row-wrapper": true,
          expanded: this.state.expanded,
          collapsed: !this.state.expanded
        })}
        style={this.props.style}
      >
        <div className="bro-log-row">
          <div className="expand-button" onClick={this.showDetails}>
            <DownArrow />
          </div>
          <div className="mini-ts">
            <p>{broLog.cast("ts").format(":ss")}</p>
          </div>
          {fields.map(name => (
            <TableCell
              key={name}
              field={broLog.getField(name)}
              appendToQuery={this.props.appendToQuery}
            />
          ))}
        </div>
        {this.state.expanded ? <XBroLogDetail broLog={broLog} /> : null}
      </div>
    )
  }
}
