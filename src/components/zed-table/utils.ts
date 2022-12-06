import {Column} from "@tanstack/react-table"
import {max} from "lodash"
import {zed} from "packages/zealot/src"
import React from "react"
import {VariableSizeGrid} from "react-window"
import {config} from "./config"
import {useZedTable} from "./context"

export function useListStyle(style: React.CSSProperties) {
  const {headerHeight} = useZedTable()
  return {
    ...style,
    height: `${parseFloat(style.height as string) + headerHeight}px`,
  }
}

export function useCellStyle(style: React.CSSProperties) {
  const {headerHeight} = useZedTable()
  return {
    ...style,
    top: `${parseFloat(style.top as string) + headerHeight}px`,
  }
}

export function useColumnSizeRerender(cols: Column<zed.Value>[]) {
  const ref = React.useRef<VariableSizeGrid | null>(null)
  React.useLayoutEffect(
    () => {
      if (ref.current) {
        ref.current.resetAfterIndices({
          columnIndex: 0,
          rowIndex: 0,
          shouldForceUpdate: true,
        })
      }
    },
    cols.map((c) => c.getSize())
  )
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
      copy.style.width = "auto"
      temp.append(copy)
    }
  }

  document.body.appendChild(temp)

  const maxWidths = {}
  for (let id of ids) {
    const cells = Array.from(temp.querySelectorAll(selector(id)))
    const widths = cells.map((cell) => cell.getBoundingClientRect().width)
    maxWidths[id] = Math.max(config.defaultCellWidth, max(widths))
  }

  temp.remove()

  return maxWidths
}
