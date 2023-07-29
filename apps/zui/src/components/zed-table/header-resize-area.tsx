import React from "react"
import {Header} from "@tanstack/react-table"
import {useZedTable} from "./context"

export function HeaderResizeArea({header}: {header: Header<any, any>}) {
  const api = useZedTable()
  return (
    <div
      className="zed-table__header-resize-area"
      onMouseDown={header.getResizeHandler()}
      onDoubleClick={() => {
        api.autosizeColumns([header.column.id])
      }}
    />
  )
}
