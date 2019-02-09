/* @flow */

import {createSelector} from "reselect"
import {uniqBy} from "lodash"

import type {Column} from "../types"
import type {State} from "../reducers/types"
import {TableColumns} from "../models/TableColumns"
import {getColumnSettings} from "./columnSettings"
import {getLogs} from "./logs"
import columnKey from "../lib/columnKey"

export const getCurrentTableKey = createSelector<State, void, *, *>(
  getLogs,
  logs => {
    if (logs.length === 0) return "none"

    const td = logs[0].get("_td")

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

export const getTableColumns = createSelector<State, void, *, *, *, *>(
  getCurrentTableKey,
  getCurrentUniqColumns,
  getColumnSettings,
  (tableKey, columns, columnSettings) => {
    return new TableColumns(tableKey, columns, columnSettings[tableKey])
  }
)
