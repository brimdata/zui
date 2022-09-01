import React, {useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import columnKey from "src/js/lib/columnKey"
import TableColumns from "src/js/models/TableColumns"
import {ViewerDimens} from "src/js/types"
import HeaderCell from "./header-cell"
import * as Styler from "./styler"
import Current from "src/js/state/Current"

type Props = {
  dimens: ViewerDimens
  scrollLeft: number
  columns: TableColumns
}

const Header = ({dimens, scrollLeft, columns, ...rest}: Props) => {
  const zed = useSelector(Current.getActiveQuery).toZed()
  const sorts = useMemo(() => brim.program(zed).ast().sorts(), [zed])

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

export default Header
