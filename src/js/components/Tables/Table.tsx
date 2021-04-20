import {typeClassNames} from "app/core/utils/type-class-names"
import React from "react"
import {ZedField, ZedRecord} from "zealot/zed"
import FieldCell from "../FieldCell"

export default function Table({className, ...props}: any) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: ZedField}) {
  return <th className={typeClassNames(column.data)}>{column.name}</th>
}

type Props = {
  record: ZedRecord
  field: ZedField
  onRightClick?: (f: ZedField, r: ZedRecord) => void
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
