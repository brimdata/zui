import * as Doc from "./Doc"

const PADDING = 6

export const belowRight = node => {
  const {left, top, height, width} = node.getBoundingClientRect()

  return {right: Doc.getWidth() - (left + width), top: top + height + PADDING}
}
