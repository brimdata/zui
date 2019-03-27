/* @flow */

import React from "react"

import type {Column} from "../../types"
import type {MenuItemData} from "../FieldActionData"
import Field from "../../models/Field"
import RightClickMenu from "../RightClickMenu"
import useContextMenu from "../../hooks/useContextMenu"

export default function Table({className, ...props}: *) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: Column}) {
  return <th className={column.type}>{column.name}</th>
}

type Props = {
  field: Field,
  rightClick?: Field => MenuItemData[]
}

export function TableData({field, rightClick}: Props) {
  const menu = useContextMenu()

  return (
    <td
      onContextMenu={menu.handleOpen}
      className={`${field.type} ${field.name}`}
    >
      {field.value}
      {menu.show && !!rightClick && (
        <RightClickMenu
          style={menu.style}
          onClose={menu.handleClose}
          actions={rightClick(field)}
        />
      )}
    </td>
  )
}
