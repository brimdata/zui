/* @flow */

export type ColumnsState = {
  [string]: {
    [string]: ColumnSetting
  }
}

export type ColumnSetting = {
  width?: number,
  isVisible?: boolean,
  position?: number
}

export type TableColumn = {
  isVisible: boolean,
  width: ?number,
  name: string,
  type: string,
  position: number
}

export type ColumnSettingsMap = {[string]: ColumnSetting}

export type ColumnUpdates = {[string]: ColumnSetting}

export type COLUMNS_UPDATE = {
  type: "COLUMNS_UPDATE",
  tableId: string,
  updates: ColumnUpdates
}
