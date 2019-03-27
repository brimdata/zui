/* @flow */

import React from "react"

import type {Descriptor} from "../../types"
import type {MenuItemData} from "../FieldActionData"
import Field from "../../models/Field"
import Log from "../../models/Log"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  descriptor: Descriptor,
  log: Log,
  rightClick?: Field => MenuItemData[]
}

export default function VerticalTable({descriptor, log, rightClick}: Props) {
  return (
    <Table className="vertical-table">
      <tbody>
        {descriptor.map((column, index) => (
          <tr key={index}>
            <TableHeader column={column} />
            <TableData field={log.getFieldAt(index)} rightClick={rightClick} />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
