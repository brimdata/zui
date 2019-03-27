/* @flow */

import React from "react"

import type {DataCell, HeaderCell} from "./types"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  headers: HeaderCell[],
  data: DataCell[]
}

export default function VerticalTable({headers, data}: Props) {
  return (
    <Table className="vertical-table">
      <tbody>
        {headers.map((header, index) => (
          <VerticalTableRow key={index} header={header} cell={data[index]} />
        ))}
      </tbody>
    </Table>
  )
}

function VerticalTableRow({header, cell}) {
  return (
    <tr>
      <TableHeader header={header} />
      <TableData cell={cell} />
    </tr>
  )
}
