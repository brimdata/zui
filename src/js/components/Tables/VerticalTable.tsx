import classNames from "classnames"
import React from "react"
import {zed} from "@brimdata/zed-js"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: zed.Field[]
  record: zed.Record
  onRightClick?: (f: zed.Field, r: zed.Record) => void
  light?: boolean
}

export default function VerticalTable({
  descriptor,
  record,
  onRightClick,
  light,
}: Props) {
  return (
    <Table className={classNames("vertical-table", {light})}>
      <tbody>
        {descriptor.map((field, index) => (
          <tr key={index}>
            <TableHeader column={field} />
            <TableData
              record={record}
              field={field}
              onRightClick={onRightClick}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
