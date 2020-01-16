/* @flow */
import {createSelector} from "reselect"

import type {ColumnsState} from "./types"
import type {State} from "../types"
import type {ViewerColumns} from "../viewer/types"
import {getViewerColumns, getViewerLogs} from "../viewer/selector"
import {uniqBy} from "../../lib/Array"
import Log from "../../models/Log"
import TableColumns from "../../models/TableColumns"
import activeTabSelect from "../tab/activeTabSelect"
import columnKey from "../../lib/columnKey"

const getColumns = activeTabSelect<ColumnsState>((tab) => tab.columns)

const getCurrentTableColumns = createSelector<
  State,
  void,
  TableColumns,
  ViewerColumns,
  ColumnsState,
  Log[],
  *
>(
  getViewerColumns,
  getColumns,
  getViewerLogs,
  (viewerColumns, columnSettings, logs) => {
    let tableKey = getTableKey(viewerColumns)
    let columns = getUniqColumns(viewerColumns)
    let table = new TableColumns(tableKey, columns, columnSettings[tableKey])
    table.setWidths(logs.slice(0, 50))
    return table
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

export default {
  getCurrentTableColumns,
  getColumns
}
