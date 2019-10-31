/* @flow */
import React from "react"

import type {$Field} from "../../brim"
import type {$Menu} from "../../electron/menu"
import {showContextMenu} from "../../lib/System"
import CellValue from "./CellValue"
import lib from "../../lib"

type Props = {
  field: $Field,
  menu: $Menu
}

export default function SingleField({field, menu}: Props) {
  return (
    <div
      className="cell-value-item"
      onClick={(e) => lib.win.selectText(e.currentTarget)}
      onContextMenu={() => showContextMenu(menu)}
    >
      <CellValue field={field} />
    </div>
  )
}
