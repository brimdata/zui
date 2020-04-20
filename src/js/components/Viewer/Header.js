/* @flow */

import {useSelector} from "react-redux"
import React, {useMemo} from "react"

import type {ViewerDimens} from "../../types"
import HeaderCell from "./HeaderCell"
import SearchBar from "../../state/SearchBar"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import brim from "../../brim"
import columnKey from "../../lib/columnKey"

type Props = {
  dimens: ViewerDimens,
  scrollLeft: number,
  columns: TableColumns
}

export default function Header({dimens, scrollLeft, columns, ...rest}: Props) {
  let program = useSelector(SearchBar.getSearchProgram)
  let sorts = useMemo(() => {
    return brim
      .program(program)
      .ast()
      .sorts()
  }, [program])

  if (dimens.rowWidth === "auto") return null
  else
    return (
      <header {...rest} style={Styler.header(dimens, scrollLeft)}>
        {columns.getVisible().map((column) => (
          <HeaderCell
            key={columnKey(column)}
            column={column}
            tableId={columns.id}
            sorts={sorts}
          />
        ))}
      </header>
    )
}
