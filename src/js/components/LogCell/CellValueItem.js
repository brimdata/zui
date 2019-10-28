/* @flow */
import React from "react"

import type {RightClickBuilder} from "../../types"
import {showContextMenu} from "../../lib/System"
import CellValue from "./CellValue"
import Field from "../../models/Field"
import Log from "../../models/Log"
import lib from "../../lib"

type Props = {
  field: Field,
  log: Log,
  valueIndex: null | number,
  menu?: RightClickBuilder
}

export default function CellValueItem({log, field, _valueIndex, menu}: Props) {
  function onContextMenu() {
    menu && showContextMenu(menu(field, log))
  }

  return (
    <div
      className="cell-value-item"
      onClick={(e) => lib.win.selectText(e.currentTarget)}
      onContextMenu={onContextMenu}
    >
      <CellValue field={field} />
    </div>
  )
}
