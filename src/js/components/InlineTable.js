/* @flow */

import React from "react"

import Log from "../models/Log"

type Props = {
  logs: Log[]
}

export default class InlineTable extends React.Component<Props> {
  render() {
    const descriptor =
      (this.props.logs[0] && this.props.logs[0].descriptor) || []

    return (
      <div className="inline-table">
        <table>
          <tr>
            {descriptor.map(column => (
              <th key={column.name}>{column.name}</th>
            ))}
          </tr>
          {this.props.logs.map((log, i) => (
            <tr key={i}>
              {log.getFields().map(field => (
                <td key={field.name} className={field.type}>
                  {field.value}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    )
  }
}
