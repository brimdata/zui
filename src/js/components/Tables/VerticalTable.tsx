import React from "react"
import classNames from "classnames"

import {Descriptor, RightClickBuilder} from "../../types"
import Log from "../../models/Log"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: Descriptor
  log: Log
  rightClick?: RightClickBuilder
  light?: boolean
}

export default function VerticalTable({
  descriptor,
  log,
  rightClick,
  light
}: Props) {
  return (
    <Table className={classNames("vertical-table", {light})}>
      <tbody>
        {descriptor.map((column, index) => (
          <tr key={index}>
            <TableHeader column={column} />
            <TableData
              log={log}
              field={log.getFieldAt(index)}
              rightClick={rightClick}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
