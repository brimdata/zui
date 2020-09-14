import * as React from "react"

import {Descriptor, RightClickBuilder} from "../../types"
import Log from "../../models/Log"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: Descriptor
  logs: Log[]
  rightClick?: RightClickBuilder
}

export default function HorizontalTable({descriptor, logs, rightClick}: Props) {
  return (
    <Table className="horizontal-table">
      <thead>
        <tr>
          {descriptor.map((column, index) => (
            <TableHeader column={column} key={index} />
          ))}
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
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
