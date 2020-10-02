import React from "react"

import {Column, RightClickBuilder} from "../../types"
import {showContextMenu} from "../../lib/System"
import FieldCell from "../FieldCell"
import {zng} from "zealot"

export default function Table({className, ...props}: any) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: Column}) {
  return <th className={column.type}>{column.name}</th>
}

type Props = {
  log: zng.Record
  field: zng.Field
  rightClick?: RightClickBuilder
}

export function TableData({field, log, rightClick}: Props) {
  const {name, data} = field

  function onContextMenu() {
    rightClick && showContextMenu(rightClick(field, log, false))
  }

  return (
    <td onContextMenu={onContextMenu} className={`${data.getType()} ${name}`}>
      <FieldCell field={field} />
    </td>
  )
}
