/* @flow */
import type {Layout} from "./Layout"

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

export const row = (layout: Layout, index: number) => {
  return {
    width: layout.rowWidth(),
    transform: `translateY(${index * layout.rowHeight()}px)`,
    height: layout.rowHeight()
  }
}

export const cell = (layout: Layout, col: string) => {
  return {
    width: layout.cellWidth(col)
  }
}
