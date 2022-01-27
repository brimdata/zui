import {Margins} from "./types"

export const innerHeight = (height: number, margins: Margins) => {
  return Math.max(height - margins.top - margins.bottom, 0)
}

export const innerWidth = (width: number, margins: Margins) => {
  return Math.max(width - margins.left - margins.right, 0)
}
