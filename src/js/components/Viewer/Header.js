/* @flow */

import React from "react"

import type {ViewerDimens} from "../../types"
import HeaderCell from "./HeaderCell"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"

type Props = {
  dimens: ViewerDimens,
  scrollLeft: number,
  columns: TableColumns
}

export default function Header({dimens, scrollLeft, columns, ...rest}: Props) {
  if (dimens.rowWidth === "auto") return null
  return (
    <header style={Styler.header(dimens, scrollLeft)} {...rest}>
      {columns.getVisible().map((column) => (
        <HeaderCell
          key={columnKey(column)}
          column={column}
          tableId={columns.id}
        />
      ))}
    </header>
  )
}
