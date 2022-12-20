import React, {useRef} from "react"
import {Header} from "@tanstack/react-table"
import {useZedTable} from "./context"
import useEventListener from "src/js/components/hooks/useEventListener"
import useListener from "src/js/components/hooks/useListener"
import useIpcListener from "src/js/components/hooks/useIpcListener"

export function HeaderResizeArea({header}: {header: Header<any, any>}) {
  // const api = useZedTable()
  const handle = header.getResizeHandler()
  return (
    <>
      <div
        className="zed-table__header-resize-area"
        onMouseDown={(e) => {
          console.log("onMouseDown")
          handle(e)
        }}
        onDoubleClick={() => {
          console.log("dbl click")
        }}
      />
    </>
  )
}
