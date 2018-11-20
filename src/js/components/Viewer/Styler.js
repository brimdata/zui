export const viewer = layout => {
  return {
    width: layout.viewWidth()
  }
}

export const view = layout => {
  return {
    height: layout.viewHeight(),
    width: layout.viewWidth()
  }
}

export const header = (layout, scrollLeft) => {
  return {
    width: layout.listWidth(),
    transform: `translateX(${scrollLeft * -1}px)`
  }
}

export const list = layout => {
  return {
    height: layout.listHeight(),
    width: layout.listWidth()
  }
}

export const row = (layout, index) => {
  return {
    transform: `translateY(${index * layout.rowHeight()}px)`,
    height: layout.rowHeight()
  }
}

export const cell = (layout, col) => {
  return {
    width: layout.cellWidth(col)
  }
}
