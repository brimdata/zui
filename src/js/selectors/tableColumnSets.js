/* @flow */

import {createSelector} from "reselect"
import {uniqBy} from "lodash"

import type {Column} from "../types"
import type {State} from "../reducers/types"
import {getLogs} from "./logs"
import TableColumns from "../models/TableColumns"
import columnKey from "../lib/columnKey"

export const getTableColumnSets = (state: State) => {
  return state.tableColumnSets
}

export const getCurrentTableColumnsId = createSelector<State, void, string, *>(
  getLogs,
  logs => {
    if (logs.length === 0) return "none"

    const td = logs[0].get("_td")
    if (!td) return "analysis"

    for (const log of logs) {
      if (log.get("_td") !== td) return "temp"
    }

    return td
  }
)

export const getCurrentUniqColumns = createSelector<State, void, *, *>(
  getLogs,
  (logs): Column[] => {
    let columns = []
    for (const log of logs) columns = columns.concat(log.descriptor)
    return uniqBy(columns, columnKey)
  }
)

export const getCurrentTableColumns = createSelector<State, void, *, *, *, *>(
  getCurrentTableColumnsId,
  getCurrentUniqColumns,
  getTableColumnSets,
  (tableKey, columns, tableSettings) => {
    const t = new TableColumns(tableKey, columns, tableSettings[tableKey])
    console.log(t)
    return t
  }
)
