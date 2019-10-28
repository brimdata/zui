/* @flow */
import React from "react"

import type {RightClickBuilder} from "../../types"
import CellValue from "./CellValue"
import Field from "../../models/Field"
import Log from "../../models/Log"
import RightClickMenu from "../RightClickMenu"
import lib from "../../lib"
import useContextMenu from "../../hooks/useContextMenu"

type Props = {
  field: Field,
  log: Log,
  valueIndex: null | number,
  menu?: RightClickBuilder
}

export default function CellValueItem({log, field, _valueIndex, menu}: Props) {
  let ctxMenu = useContextMenu()

  function handleRightClick(e) {
    e.stopPropagation()
    ctxMenu.handleOpen(e)
  }

  function handleRightClickDismiss(e) {
    lib.win.clearTextSelection()
    e.stopPropagation()
    ctxMenu.handleClose()
  }

  return (
    <div
      className="cell-value-item"
      onClick={(e) => lib.win.selectText(e.currentTarget)}
      onContextMenu={handleRightClick}
    >
      <CellValue field={field} />
      {menu && ctxMenu.show && (
        <RightClickMenu
          actions={menu(field, log)}
          onClose={handleRightClickDismiss}
          style={ctxMenu.style}
        />
      )}
    </div>
  )
}
