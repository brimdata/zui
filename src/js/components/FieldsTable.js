/* @flow */

import React from "react"

import {XDetailFieldActions} from "./FieldActions"
import Log from "../models/Log"
import useContextMenu from "../hooks/useContextMenu"

type TableProps = {
  log: Log,
  only?: string[]
}

export default function FieldsTable({log, only}: TableProps) {
  const rows = []
  const {tuple} = log

  if (only) {
    only.forEach(name => {
      const field = log.getField(name)
      if (field) {
        rows.push(<TableRow key={name} field={field} log={log} />)
      }
    })
  } else {
    for (let index = 0; index < tuple.length; index++) {
      const field = log.getFieldAt(index)
      if (field) {
        if (field.name === "_td") continue
        rows.push(<TableRow key={field.name} field={field} log={log} />)
      }
    }
  }

  return (
    <table className="fields-table">
      <tbody>{rows}</tbody>
    </table>
  )
}

function TableRow({field, log}) {
  const menu = useContextMenu()

  return (
    <tr onContextMenu={menu.handleOpen}>
      <th>{field.name}</th>
      <td className={field.type}>{field.value}</td>
      {menu.show && (
        <XDetailFieldActions
          log={log}
          field={field}
          style={menu.style}
          onClose={menu.handleClose}
        />
      )}
    </tr>
  )
}
