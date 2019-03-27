/* @flow */

import React from "react"

import type {DataCell, HeaderCell} from "./types"
import type {MenuItemData} from "../FieldActionData"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  headers: HeaderCell[],
  data: DataCell[],
  rightClick?: DataCell => MenuItemData[]
}

export default function VerticalTable({headers, data, rightClick}: Props) {
  return (
    <Table className="vertical-table">
      <tbody>
        {headers.map((header, index) => (
          <tr key={index}>
            <TableHeader header={header} />
            <TableData cell={data[index]} rightClick={rightClick} />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
