import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import ColumnWidths from "../components/Viewer/ColumnWidths"
import * as mainSearch from "./mainSearch"
import * as descriptors from "./descriptors"
import * as spaces from "./spaces"
import UniqArray from "../models/UniqArray"
import isEqual from "lodash/isEqual"
import Columns from "../models/Columns"

const initialState = []

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
  },
  COLUMNS_TOGGLE: (state, {column}) => {
    const exists = state.find(c => isEqual(c, column))
    if (exists) {
      return state.filter(c => c !== exists)
    } else {
      return [column, ...state]
    }
  }
})

export const getAll = state => {
  return state.columns
}

export const getWidths = createSelector(
  getAll,
  columnWidths.getAll,
  (columns, columnWidths) => {
    if (columns.length > 0) {
      return new ColumnWidths(columns.map(c => c.name), columnWidths)
    }
  }
)

export const getColumnsFromTds = createSelector(
  mainSearch.getTds,
  descriptors.getDescriptors,
  spaces.getCurrentSpaceName,
  (tds, descriptors, space) => {
    const columns = new UniqArray(isEqual)
    tds.forEach(td => {
      const desc = descriptors[space + "." + td]
      if (desc) desc.forEach(d => columns.push(d))
    })
    return columns.toArray()
  }
)

export const getColumns = createSelector(
  mainSearch.getTds,
  getColumnsFromTds,
  getAll,
  (tds, all, visible) => createColumns(tds, all, visible)
)

export const createColumns = (tds, all, visible) => {
  if (visible.length === 0) {
    return new Columns({tds, all, visible: all})
  } else {
    return new Columns({tds, all, visible})
  }
}
