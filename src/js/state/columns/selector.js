/* @flow */
import {createSelector} from "reselect"

import type {Column} from "../../types"
import type {State} from "../reducers/types"
import {getViewerLogs} from "../viewer/selector"
import {uniqBy} from "../../lib/Array"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"

export function getColumns(state: State) {
  return state.columns
}

export const getCurrentTableColumnsId = createSelector<State, void, string, *>(
  getViewerLogs,
  (logs) => {
    if (logs.length === 0) return "none"

    const td = logs[0].get("_td")
    if (!td) return "analysis"

    // if (getViewerDescriptors().length === 1) return desc.idHash()
    for (const log of logs) {
      if (log.get("_td") !== td) return "temp"
    }

    return td
  }
)

export const getCurrentUniqColumns = createSelector<State, void, *, *>(
  getViewerLogs,
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
  getColumns,
  (tableKey, columns, tableSettings) => {
    return new TableColumns(tableKey, columns, tableSettings[tableKey])
  }
)
