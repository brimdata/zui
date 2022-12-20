import React, {useRef} from "react"
import {Header} from "@tanstack/react-table"
import {useZedTable} from "./context"
import useEventListener from "src/js/components/hooks/useEventListener"
import useListener from "src/js/components/hooks/useListener"
import useIpcListener from "src/js/components/hooks/useIpcListener"

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
