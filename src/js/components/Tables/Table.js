/* @flow */

import React from "react"

import type {Column, RightClickBuilder} from "../../types"
import Field from "../../models/Field"
import Log from "../../models/Log"
import RightClickMenu from "../RightClickMenu"
import useContextMenu from "../../hooks/useContextMenu"

export default function Table({className, ...props}: *) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: Column}) {
  return <th className={column.type}>{column.name}</th>
}

type Props = {
  log: Log,
  field: Field,
  rightClick?: RightClickBuilder
}

export function TableData({field, log, rightClick}: Props) {
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
          actions={rightClick(field, log)}
        />
      )}
    </td>
  )
}
