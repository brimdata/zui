/* @flow */
import {type Descriptor} from "../models/Log"
type ColWidths = {[string]: number}

export const setColumnsFromDescriptor = (
  group: string,
  descriptor: Descriptor
) => ({
  type: "COLUMNS_SET_FROM_DESCRIPTOR",
  group,
  descriptor
})

export const setColumnWidths = (group: string, widths: ColWidths) => ({
  type: "COLUMN_WIDTHS_SET",
  group,
  widths
})

export const setColumnVisibility = (
  group: string,
  index: number,
  isVisible: boolean
) => ({
  type: "COLUMN_VISIBILITY_SET",
  group,
  index,
  isVisible
})
