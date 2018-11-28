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
    return new ColumnWidths(columns.map(c => c.name), columnWidths)
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
  columnWidths.getAll,
  (tds, all, visible, widths) => createColumns(tds, all, visible, widths)
)

export const createColumns = (tds, all, visible, widths) => {
  visible = visible.length === 0 ? all : visible

  return new Columns(
    all.map(({name, type}) => ({
      name,
      type,
      isVisible: !!visible.find(vis => vis.name === name && vis.type === type),
      width: name in widths ? widths[name] : widths.default
    }))
  )
}
