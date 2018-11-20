import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as columnWidths from "./columnWidths"
import AutoColumns from "../components/Viewer/AutoColumns"
import FixedColumns from "../components/Viewer/FixedColumns"

const initialState = []

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
  }
})

export const getAll = state => {
  return state.columns
}

export const getManager = createSelector(
  getAll,
  columnWidths.getAll,
  (columns, columnWidths) => {
    if (columns.length === 0) {
      return new AutoColumns()
    } else {
      return new FixedColumns(columns.map(c => c.name), columnWidths)
    }
  }
)
