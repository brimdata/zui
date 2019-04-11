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

export default function InlineTable({logs, actions}: Props) {
  const descriptor = (logs[0] && logs[0].descriptor) || []

  return (
    <div className="inline-table">
      <table>
        <thead>
          <tr>
            {descriptor.map((column) => (
              <th key={column.name} className={column.type}>
                {column.name}
              </th>
            ))}
            {actions && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <TableRow log={log} key={i} actions={actions} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableRow({log, actions}) {
  return (
    <tr>
      {log.getFields().map((field) => (
        <TableCell field={field} key={field.name} />
      ))}
      {actions && <ActionsCell actions={actions} log={log} />}
    </tr>
  )
}

function TableCell({field}) {
  return (
    <td key={field.name} className={field.type}>
      {field.value}
    </td>
  )
}

function ActionsCell({actions, log}) {
  return (
    <td>
      {actions.map((a, i) => (
        <ActionButton key={i} action={a} log={log} />
      ))}
    </td>
  )
}

function ActionButton({action, log}) {
  return <button onClick={action.click.bind(null, log)}>{action.text}</button>
}
