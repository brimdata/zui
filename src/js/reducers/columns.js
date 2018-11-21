import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import ColumnWidths from "../components/Viewer/ColumnWidths"

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
