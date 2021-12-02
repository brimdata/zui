import {typeClassNames} from "app/core/utils/type-class-names"
import React from "react"
import {zed} from "zealot-old"
import FieldCell from "../FieldCell"

export default function Table({className, ...props}: any) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: zed.Field}) {
  return <th className={typeClassNames(column.data)}>{column.name}</th>
}

type Props = {
  record: zed.Record
  field: zed.Field
  onRightClick?: (f: zed.Field, r: zed.Record) => void
}

export function TableData({field, record, onRightClick}: Props) {
  const {name, data} = field

  function onContextMenu() {
    onRightClick && onRightClick(field, record)
  }

  return (
    <td
      onContextMenu={onContextMenu}
      className={`${typeClassNames(data)} ${name}`}
    >
      <FieldCell field={field} record={record} />
    </td>
  )
}
