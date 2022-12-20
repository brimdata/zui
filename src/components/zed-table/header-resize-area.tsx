import React from "react"
import {Header} from "@tanstack/react-table"
import {useZedTable} from "./context"
import {getMaxCellSizes} from "./utils"
import {config} from "./config"

export function HeaderResizeArea({header}: {header: Header<any, any>}) {
  const api = useZedTable()
  return (
    <div
      className="zed-table__header-resize-area"
      onDoubleClick={() => {
        const id = header.column.id
        const sizes = getMaxCellSizes(api.container, [id])
        api.setColumnWidths(sizes)
      }}
      // onMouseDown={header.getResizeHandler()}
    />
  )
}
