/* @flow */

export type ColumnsAction = COLUMNS_UPDATE | COLUMNS_HIDE_ALL | COLUMNS_SHOW_ALL

export type ColumnsState = {
  [string]: {
    [string]: ColumnSetting
  }
}

export type ColumnSetting = {|
  width?: number,
  isVisible?: boolean,
  position?: number
|}

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

export type COLUMNS_SHOW_ALL = {
  type: "COLUMNS_SHOW_ALL",
  tableId: string
}

export type COLUMNS_HIDE_ALL = {
  type: "COLUMNS_HIDE_ALL",
  tableId: string
}
