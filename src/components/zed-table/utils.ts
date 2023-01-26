import {max} from "lodash"
import React, {useEffect} from "react"
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

export function getMaxCellSizes(container: HTMLDivElement, ids: string[]) {
  const selector = (id: string) => `[data-header-id="${id}"]`
  const selector2 = (id: string) => `[data-column-id="${id}"]`

  const maxWidths = {}
  for (let id of ids) {
    const cells1 = Array.from(container.querySelectorAll(selector(id)))
    const cell2 = Array.from(container.querySelectorAll(selector2(id)))
    const cells = [...cells1, ...cell2] as HTMLElement[]
    const oldWidths = cells.map((el) => el.style.width)
    cells.forEach((el) => (el.style.width = "auto"))
    const widths = cells.map((cell) => cell.scrollWidth + 8)
    cells.forEach((el, i) => (el.style.width = oldWidths[i]))
    const maxWidth = Math.max(config.defaultCellWidth, max(widths))
    if (isNaN(maxWidth)) continue
    maxWidths[id] = maxWidth
  }

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
