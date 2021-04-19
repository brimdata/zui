import classNames from "classnames"
import React from "react"
import {ZedField, ZedRecord} from "zealot/zed/data-types"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: ZedField[]
  record: ZedRecord
  onRightClick?: (f: ZedField, r: ZedRecord) => void
  light?: boolean
}

export default function VerticalTable({
  descriptor,
  record,
  onRightClick,
  light
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
