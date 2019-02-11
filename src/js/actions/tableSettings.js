/* @flow */
import type {ColumnSetting} from "../types"

export const updateTableSettings = (
  tableKey: string,
  updates: {[string]: ColumnSetting}
) => ({
  type: "TABLE_SETTINGS_UPDATE",
  tableKey,
  updates
})
