import {Margins} from "./types"

export function innerHeight(height: number, margins: Margins) {
  return Math.max(height - margins.top - margins.bottom, 0)
}

export function innerWidth(width: number, margins: Margins) {
  return Math.max(width - margins.left - margins.right, 0)
}
