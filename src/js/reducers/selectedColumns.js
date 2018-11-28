/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import * as mainSearch from "./mainSearch"
import * as descriptors from "./descriptors"
import * as spaces from "./spaces"
import UniqArray from "../models/UniqArray"
import Columns from "../models/Columns"
import columnOrder from "../lib/columnOrder"
import type {State} from "./types"
import type {ColumnWidths} from "./columnWidths"

const initialState = []

export type SelectedColumns = {name: string, type: string}[]

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
  },
  COLUMNS_TOGGLE: (state, {column}) => {
    const exists = state.find(
      c => c.name === column.name && c.type === column.type
    )
    if (exists) {
      return state.filter(c => c !== exists)
    } else {
      return [column, ...state]
    }
  }
})

export const getAll = (state: State) => {
  return state.selectedColumns
}

type TdColumns = {name: string, type: string, td: string}[]

export const getColumnsFromTds = createSelector(
  mainSearch.getTds,
  descriptors.getDescriptors,
  spaces.getCurrentSpaceName,
  (tds, descriptors, space): TdColumns => {
    const uniq = new UniqArray(isSame)
    tds.forEach(td => {
      const desc = descriptors[space + "." + td]
      if (desc) {
        desc.forEach(field => uniq.push({td, ...field}))
      }
    })
    return uniq.toArray()
  }
)

export const getColumns = createSelector(
  getColumnsFromTds,
  getAll,
  columnWidths.getAll,
  (all, selected, widths) => createColumns(all, selected, widths)
)

export const createColumns = (
  all: TdColumns,
  selected: SelectedColumns,
  widths: ColumnWidths
) => {
  const noSelection = selected.length === 0
  const ordered = columnOrder(all)
  const columns = ordered.map(col => ({
    name: col.name,
    type: col.type,
    td: col.td,
    isVisible: noSelection || !!selected.find(c => isSame(c, col)),
    width: col.name in widths ? widths[col.name] : widths.default
  }))

  return new Columns(columns)
}

const isSame = (a, b) => {
  return a.name === b.name && a.type === b.type
}
