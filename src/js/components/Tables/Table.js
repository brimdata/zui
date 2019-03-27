/* @flow */

import React from "react"

import type {DataCell, HeaderCell} from "./types"
import type {MenuItemData} from "../FieldActionData"
import RightClickMenu from "../RightClickMenu"
import useContextMenu from "../../hooks/useContextMenu"

export default function Table({className, ...props}: *) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({header}: {header: HeaderCell}) {
  return <th className={header.type}>{header.name}</th>
}

type Props = {
  cell: DataCell,
  rightClick?: DataCell => MenuItemData[]
}

export function TableData({cell, rightClick}: Props) {
  const menu = useContextMenu()

  return (
    <td onContextMenu={menu.handleOpen} className={`${cell.type} ${cell.name}`}>
      {cell.value}
      {menu.show && !!rightClick && (
        <RightClickMenu
          style={menu.style}
          onClose={menu.handleClose}
          actions={rightClick(cell)}
        />
      )}
    </td>
  )
}
