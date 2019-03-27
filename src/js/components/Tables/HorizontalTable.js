/* @flow */

import * as React from "react"

import type {Descriptor} from "../../types"
import Log from "../../models/Log"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: Descriptor,
  logs: Log[],
  Actions?: React.AbstractComponent<{log: Log}>
}

export default function HorizontalTable({descriptor, logs, Actions}: Props) {
  return (
    <Table className="horizontal-table">
      <thead>
        <tr>
          {descriptor.map((column, index) => (
            <TableHeader column={column} key={index} />
          ))}
          {!!Actions && (
            <TableHeader column={{name: "actions", type: "actions"}} />
          )}
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <TableRow log={log} key={index} Actions={Actions} />
        ))}
      </tbody>
    </Table>
  )
}

function TableRow({log, Actions}) {
  return (
    <tr>
      {log.map((field, index) => (
        <TableData field={field} key={index} />
      ))}
      {!!Actions && (
        <td>
          <Actions log={log} />
        </td>
      )}
    </tr>
  )
}
