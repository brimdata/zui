/* @flow */

import * as React from "react"

import type {Descriptor, RightClickBuilder} from "../../types"
import Log from "../../models/Log"
import Table, {TableData, TableHeader} from "./Table"

type Props = {|
  descriptor: Descriptor,
  logs: Log[],
  rightClick?: RightClickBuilder,
  Actions?: React.AbstractComponent<{log: Log}>
|}

export default function HorizontalTable({
  descriptor,
  logs,
  Actions,
  rightClick
}: Props) {
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
          <tr key={index}>
            {log.map((field, index) => (
              <TableData
                field={field}
                log={log}
                key={index}
                rightClick={rightClick}
              />
            ))}
            {!!Actions && (
              <td>
                <Actions log={log} />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
