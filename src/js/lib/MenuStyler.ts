import lib from "./"

const PADDING = 6

type Node = HTMLElement
type Position = string

export const getStyle = (node: Node, position: Position) => {
  switch (position) {
    case "left":
      return belowLeft(node)
    case "right":
      return belowRight(node)
    case "right-wall":
      return rightWall()
    default:
      throw new Error("Unknown Menu Position")
  }
}

export const belowRight = (node: Node) => {
  const {left, top, height, width} = node.getBoundingClientRect()

  return {
    right: lib.win.getWidth() - (left + width),
    top: top + height + PADDING,
    bottom: 10
  }
}

export const belowLeft = (node: Node) => {
  const {left, top, height} = node.getBoundingClientRect()

  return {left, top: top + height + PADDING}
}

export const rightWall = () => {
  return {
    right: 0,
    top: 0,
    height: lib.win.getHeight()
  }
}

type Bounds = {width: number; height: number}
type Style = {top?: number; left?: number; right?: number}

export const ensureVisible = (bounds: Bounds, style: Style) => {
  const {width, height} = bounds
  const {top, left, right} = style
  const newStyle = {...style}

  if ("right" in style) {
    if (right + width > lib.win.getWidth()) {
      newStyle.right = right - width
    }
  }

  if ("left" in style) {
    if (left + width > lib.win.getWidth()) {
      newStyle.left = left - width
    }
  }

  if (top + height > lib.win.getHeight()) {
    newStyle.top = top - height
  }

  return newStyle
}

export const getTooltipStyle = (el: Node) => {
  if (!el) return {}
  const {top, left} = el.getBoundingClientRect()
  return {top: top - 21, left: left + 4}
}
