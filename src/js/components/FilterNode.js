import React from "react"
import * as Time from "../lib/Time"
import {extractLastTimeWindow} from "../changeProgramTimeWindow"
import {shortDateTime} from "../timeWindowFormatter"
import X from "../icons/x-md.svg"

export default class FilterNode extends React.PureComponent {
  render() {
    const classNames = ["filter-node"]
    if (this.props.focused) classNames.push("focused")

    if (this.props.pending) classNames.push("pending")

    return (
      <div className={classNames.join(" ")} onClick={this.props.onClick}>
        <p>{shortenTimeWindow(this.props.filter)}</p>
        {this.props.onRemoveClick && (
          <button className="remove-button" onClick={this.props.onRemoveClick}>
            <X />
          </button>
        )}
      </div>
    )
  }
}

const TIME_WINDOW_REGEX = /\(ts\s*>=\s*\d{10}\.\d{6}\s+and\s+ts\s*<\s*\s*\d{10}\.\d{6}\s*\)/i

export function shortenTimeWindow(program) {
  const timeWindow = extractLastTimeWindow(program)
  if (timeWindow) {
    const [from, to] = timeWindow.map(d => Time.parse(d))
    const duration = Time.parse.duration(Time.parse(from).diff(to)).humanize()
    const match = program.match(TIME_WINDOW_REGEX)
    const beginning = program.substring(0, match.index)
    const ending = program.substring(match.index + match[0].length)
    const title = shortDateTime(from) + " - " + shortDateTime(to)
    return [
      beginning,
      <span className="short-time-window" key={2} title={title}>
        {shortDateTime(from)} + {duration}
      </span>,
      ending
    ]
  }
  return program
}
