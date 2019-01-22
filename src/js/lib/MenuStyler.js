import * as Doc from "./Doc"

const PADDING = 6

export const getStyle = (node, position) => {
  switch (position) {
    case "left":
      return belowLeft(node)
    case "right":
      return belowRight(node)
    case "right-wall":
      return rightWall(node)
    default:
      throw new Error("Unknown Menu Position")
  }
}

export const belowRight = node => {
  const {left, top, height, width} = node.getBoundingClientRect()

  return {
    right: Doc.getWidth() - (left + width),
    top: top + height + PADDING,
    bottom: 10
  }
}

export const belowLeft = node => {
  const {left, top, height} = node.getBoundingClientRect()

  return {left, top: top + height + PADDING}
}

export const rightWall = _node => {
  return {
    right: 0,
    top: 0,
    height: Doc.getHeight()
  }
}
