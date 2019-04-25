/* @flow */
import {createSelector} from "reselect"

import type {ColumnsState} from "./types"
import type {State} from "../types"
import type {ViewerColumns} from "../viewer/types"
import {getViewerColumns} from "../viewer/selector"
import {uniqBy} from "../../lib/Array"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"

export function getColumns(state: State) {
  return state.columns
}

export const getCurrentTableColumns = createSelector<
  State,
  void,
  TableColumns,
  ViewerColumns,
  ColumnsState,
  *
>(
  getViewerColumns,
  getColumns,
  (viewerColumns, columnSettings) => {
    let tableKey = getTableKey(viewerColumns)
    let columns = getUniqColumns(viewerColumns)
    return new TableColumns(tableKey, columns, columnSettings[tableKey])
  }
)

function getTableKey(columns) {
  let ids = Object.keys(columns)
  if (ids.length === 0) return "none"
  if (ids.length === 1) return ids[0]
  return "temp"
}

function getUniqColumns(columns) {
  let allCols = []
  for (const id in columns) allCols = [...allCols, ...columns[id]]
  return uniqBy(allCols, columnKey)
}
