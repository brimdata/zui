import {max} from "lodash"
import {cssVar} from "polished"
import React, {useEffect} from "react"
import {VariableSizeGrid} from "react-window"
import {config} from "./config"
import {useZedTable} from "./context"

export function useListStyle(style: React.CSSProperties) {
  const api = useZedTable()
  return {
    ...style,
    height: `${parseFloat(style.height as string) + api.totalHeaderHeight}px`,
  }
}

export function useCellStyle(style: React.CSSProperties) {
  const api = useZedTable()
  return {
    ...style,
    top: `${parseFloat(style.top as string) + api.totalHeaderHeight}px`,
  }
}

// RETHINK THIS BAD BOY
export function useColumnSizeRerender() {
  const api = useZedTable()
  const ref = React.useRef<VariableSizeGrid | null>(null)
  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      })
    }
  }, [api, api.state.columnWidth, api.columnCount, api.headerGroups.length])

  React.useLayoutEffect(() => {
    api.onCellChanged((cell) => {
      const {columnIndex, rowIndex} = cell.position
      if (columnIndex === -1) return
      if (ref.current) {
        ref.current.resetAfterIndices({
          columnIndex,
          rowIndex,
          shouldForceUpdate: false,
        })
      }
    })
  }, [api])

  return ref
}

export function getMaxCellSizes(container: HTMLDivElement, ids: string[]) {
  const temp = document.createElement("div")
  const selector = (id: string) => `[data-column-id="${id}"]`
  const columns = {}
  for (let id of ids) {
    columns[id] = Array.from(container.querySelectorAll(selector(id)))
  }

  for (let id of ids) {
    for (let cell of columns[id]) {
      const copy = cell.cloneNode(true) as HTMLElement
      copy.style.display = "inline-block"
      copy.style.width = "auto"
      copy.style.fontFamily = cssVar("--mono-font") as string
      copy.style.paddingRight = "10px"
      temp.append(copy)
    }
  }

  document.body.appendChild(temp)

  const maxWidths = {}
  for (let id of ids) {
    const cells = Array.from(temp.querySelectorAll(selector(id)))
    const widths = cells.map((cell) => cell.getBoundingClientRect().width)
    const maxWidth = Math.max(config.defaultCellWidth, max(widths))
    if (isNaN(maxWidth)) continue
    maxWidths[id] = maxWidth
  }

  temp.remove()

  return maxWidths
}

export const identifyCell = (id: string) => {
  const [cellId, ...valuePathString] = id.split(",")
  const valueIndexPath = valuePathString.map((s) => parseInt(s))
  const [row, col] = cellId.split("_")
  const rowIndex = parseInt(row)
  const columnIndex = parseInt(col)
  return {
    cellId,
    columnIndex,
    rowIndex,
    valueIndexPath,
  }
}

export function useResizingClasses() {
  const api = useZedTable()
  useEffect(() => {
    if (api.isResizing) {
      document.body.classList.add("no-select", "col-resize")
    } else {
      document.body.classList.remove("no-select", "col-resize")
    }
    return () => {
      document.body.classList.remove("no-select", "col-resize")
    }
  }, [api.isResizing])
}
