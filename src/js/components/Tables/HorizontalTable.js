/* @flow */

import * as React from "react"

import type {DataCell, HeaderCell} from "./types"
import Table, {TableData, TableHeader} from "./Table"

type Props = {
  headers: HeaderCell[],
  data: DataCell[][],
  Actions?: React.AbstractComponent<{row: DataCell[]}>
}

export default function HorizontalTable({headers, data, Actions}: Props) {
  return (
    <Table className="horizontal-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeader header={header} key={index} />
          ))}
          {!!Actions && (
            <TableHeader header={{name: "actions", type: "actions"}} />
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((cells, index) => (
          <TableRow cells={cells} key={index} Actions={Actions} />
        ))}
      </tbody>
    </Table>
  )
}

function TableRow({cells, Actions}) {
  return (
    <tr>
      {cells.map((cell, index) => (
        <TableData cell={cell} key={index} />
      ))}
      {!!Actions && (
        <td>
          <Actions row={cells} />
        </td>
      )}
    </tr>
  )
}
