import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import ColumnWidths from "../components/Viewer/ColumnWidths"
import * as mainSearch from "./mainSearch"
import * as descriptors from "./descriptors"
import * as spaces from "./spaces"
import UniqArray from "../models/UniqArray"
import isEqual from "lodash/isEqual"
const initialState = []

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
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
  mainSearch.getMainSearchEvents,
  descriptors.getDescriptors,
  spaces.getCurrentSpaceName,
  (tuples, descriptors, space) => {
    const tds = new UniqArray()
    tuples.forEach(([td]) => tds.push(td))
    const columns = new UniqArray(isEqual)
    tds.toArray().forEach(td => {
      const desc = descriptors[space + "." + td]
      if (desc) desc.forEach(d => columns.push(d))
    })

    return columns.toArray()
  }
)
