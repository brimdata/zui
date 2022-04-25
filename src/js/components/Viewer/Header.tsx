import React, {useMemo} from "react"
import {useSelector} from "react-redux"
import Url from "src/js/state/Url"
import brim from "../../brim"
import columnKey from "../../lib/columnKey"
import TableColumns from "../../models/TableColumns"
import {ViewerDimens} from "../../types"
import HeaderCell from "./HeaderCell"
import * as Styler from "./Styler"

type Props = {
  dimens: ViewerDimens
  scrollLeft: number
  columns: TableColumns
}

export default function Header({dimens, scrollLeft, columns, ...rest}: Props) {
  const program = useSelector(Url.getSearchProgram)
  const sorts = useMemo(() => brim.program(program).ast().sorts(), [program])

  if (dimens.rowWidth === "auto") return null

  return (
    <header {...rest} style={Styler.header(dimens, scrollLeft)}>
      {columns.getVisible().map((column) => (
        <HeaderCell
          key={columnKey(column.name)}
          column={column}
          tableId={columns.id}
          sorts={sorts}
        />
      ))}
    </header>
  )
}
