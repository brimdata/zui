/* @flow */
import type {ColumnSetting} from "../types"

export const updateTableLayout = (
  tableKey: string,
  updates: {[string]: ColumnSetting}
) => ({
  type: "TABLE_LAYOUT_UPDATE",
  tableKey,
  updates
})
