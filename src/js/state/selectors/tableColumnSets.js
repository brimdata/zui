/* @flow */

import {createSelector} from "reselect"
import {uniqBy} from "lodash"

import type {Column} from "../types"
import type {State} from "../state/reducers/types"
import {getLogs} from "./logs"
import TableColumns from "../models/TableColumns"
import columnKey from "../lib/columnKey"

export const getTableColumnSets = (state: State) => {
  return state.tableColumnSets
}

export const getCurrentTableColumnsId = createSelector<State, void, string, *>(
  getLogs,
  (logs) => {
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
    /* Performance seriously matters in this function.  See PROD-405 */

    if (logs.length === 0) return []
    if (!logs[0].get("_td")) return logs[0].descriptor

    let colMap = {}
    for (const log of logs) {
      const td = log.get("_td")
      if (colMap[td]) continue
      colMap[td] = log.descriptor
    }

    let columns = []
    for (const td in colMap) {
      columns = [...columns, ...colMap[td]]
    }

    return uniqBy(columns, columnKey)
  }
)

export const getCurrentTableColumns = createSelector<State, void, *, *, *, *>(
  getCurrentTableColumnsId,
  getCurrentUniqColumns,
  getTableColumnSets,
  (tableKey, columns, tableSettings) => {
    return new TableColumns(tableKey, columns, tableSettings[tableKey])
  }
)
