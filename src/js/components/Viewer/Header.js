/* @flow */

import {useSelector} from "react-redux"
import React, {useMemo} from "react"

import type {ViewerDimens} from "../../types"
import {getSearchProgram} from "../../state/selectors/searchBar"
import HeaderCell from "./HeaderCell"
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
  if (dimens.rowWidth === "auto") return null

  let program = useSelector(getSearchProgram)
  let sorts = useMemo(() => {
    let obj = {}
    brim
      .program(program)
      .ast()
      .procs("SortProc")
      .forEach((sort) => {
        sort.fields.forEach((field) => {
          obj[field] = sort.sortdir === 1 ? "asc" : "desc"
        })
      })
    return obj
  }, [program])

  return (
    <header style={Styler.header(dimens, scrollLeft)} {...rest}>
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
