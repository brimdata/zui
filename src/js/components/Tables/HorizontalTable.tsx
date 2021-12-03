import * as React from "react"
import {zed} from "@brimdata/zealot"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: zed.Field[]
  logs: zed.Record[]
  onRightClick?: (f: zed.Field, r: zed.Record) => void
}

export default function HorizontalTable({
  descriptor,
  logs,
  onRightClick
}: Props) {
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
            {log.fields.map((field, index) => (
              <TableData
                field={field}
                record={log}
                key={index}
                onRightClick={onRightClick}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
