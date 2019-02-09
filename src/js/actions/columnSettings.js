/* @flow */
import type {ColumnSetting} from "../types"

export const updateColumnSetting = (
  tableKey: string,
  columnKey: string,
  setting: ColumnSetting
) => ({
  type: "COLUMN_SETTING_UPDATE",
  tableKey,
  columnKey,
  setting
})
