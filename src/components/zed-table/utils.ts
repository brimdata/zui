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
  // const temp = document.createElement("div")
  const selector = (id: string) => `[data-column-id="${id}"]`
  //   const columns = {}
  //   for (let id of ids) {
  //     columns[id] = Array.from(container.querySelectorAll(selector(id)))
  //   }
  //
  //   for (let id of ids) {
  //     for (let cell of columns[id]) {
  //       const copy = cell.cloneNode(true) as HTMLElement
  //       copy.style.display = "inline-block"
  //       copy.style.width = "auto"
  //       copy.style.paddingRight = "10px"
  //       temp.append(copy)
  //     }
  //   }
  //
  //   document.body.appendChild(temp)

  const maxWidths = {}
  for (let id of ids) {
    const cells = Array.from(container.querySelectorAll(selector(id)))
    const widths = cells.map((cell) => {
      return cell.scrollWidth + 10
    })
    const maxWidth = Math.max(config.defaultCellWidth, max(widths))
    // console.log({maxWidth})
    if (isNaN(maxWidth)) continue
    maxWidths[id] = maxWidth
  }

  // temp.remove()

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
