import React from "react"
import classNames from "classnames"

import {RightClickBuilder} from "../../types"
import Table, {TableData, TableHeader} from "./Table"
import {zjson, zng} from "zealot"

type Props = {
  descriptor: zjson.Column[]
  log: zng.Record
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
              field={new zng.Field(column.name, log.at(index))}
              rightClick={rightClick}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
