/* @flow */

import React from "react"

import Log from "../models/Log"

type InlineTableAction = {
  text: string,
  click: (log: Log) => void
}

type Props = {
  logs: Log[],
  actions?: InlineTableAction[]
}

export default class InlineTable extends React.Component<Props> {
  render() {
    const descriptor =
      (this.props.logs[0] && this.props.logs[0].descriptor) || []

    return (
      <div className="inline-table">
        <table>
          <thead>
            <tr>
              {descriptor.map(column => (
                <th key={column.name} className={column.type}>
                  {column.name}
                </th>
              ))}
              {this.props.actions && <th>actions</th>}
            </tr>
          </thead>
          <tbody>
            {this.props.logs.map((log, i) => (
              <tr key={i}>
                {log.getFields().map(field => (
                  <td key={field.name} className={field.type}>
                    {field.value}
                  </td>
                ))}
                {this.props.actions && (
                  <td>
                    {this.props.actions.map((a, i) => (
                      <button key={i} onClick={a.click.bind(null, log)}>
                        {a.text}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
