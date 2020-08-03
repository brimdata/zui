/* @flow */
import type {ViewerSelectionData} from "../types"

export type ViewerSelection = {
  includes: (number) => boolean
}

export function createSelection(data: ViewerSelectionData): ViewerSelection {
  return {
    includes(row: number) {
      return data.rows[row] === true
    }
  }
}
