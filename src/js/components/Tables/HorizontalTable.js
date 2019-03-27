/* @flow */

import React from "react"

import type {DataCell, HeaderCell} from "./types"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  headers: HeaderCell[],
  data: DataCell[][]
}

export default function VerticalTable({headers, data}: Props) {
  return (
    <Table className="horizontal-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeader header={header} key={index} />
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((cells, index) => (
          <TableRow cells={cells} key={index} />
        ))}
      </tbody>
    </Table>
  )
}

function TableRow({cells}) {
  return (
    <tr>
      {cells.map((cell, index) => (
        <TableData cell={cell} key={index} />
      ))}
    </tr>
  )
}
