import * as React from "react"

import {RightClickBuilder} from "../../types"
import Table, {TableData, TableHeader} from "./Table"
import {zjson, zng} from "zealot"

type Props = {
  descriptor: zjson.Column[]
  logs: zng.Record[]
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
            {log.getFields().map((field, index) => (
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
