/* @flow */
import type {Layout} from "./Layout"
import type {TableColumn} from "../../types"

export const viewer = (layout: Layout) => {
  return {
    width: layout.viewWidth()
  }
}

export const view = (layout: Layout) => {
  return {
    height: layout.viewHeight(),
    width: layout.viewWidth()
  }
}

export const header = (layout: Layout, scrollLeft: number) => {
  return {
    width: layout.listWidth(),
    transform: `translateX(${scrollLeft * -1}px)`
  }
}

export const list = (layout: Layout) => {
  return {
    height: layout.listHeight(),
    width: layout.listWidth()
  }
}

export const chunk = (layout: Layout, index: number, chunkSize: number) => {
  return {
    width: layout.rowWidth(),
    transform: `translateY(${index * layout.rowHeight()}px)`,
    height: layout.rowHeight() * chunkSize
  }
}

export const row = (layout: Layout) => {
  return {
    width: layout.rowWidth(),
    height: layout.rowHeight()
  }
}

export const cell = (layout: Layout, column: TableColumn) => {
  return {
    width: layout.cellWidth(column)
  }
}

export const endMessage = (layout: Layout) => {
  return {
    height: layout.rowHeight() * 4,
    transform: `translateY(${layout.listHeight()}px)`,
    width: layout.viewWidth()
  }
}
