/* @flow */

import AppError from "../models/AppError"

export type Notification =
  | AppError
  | {
      type: string,
      data: Object,
      key: string
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

export type ColumnSettingsMap = {
  [string]: ColumnSetting
}

export type Column = {type: string, name: string}

export type Descriptor = Column[]

export type Tuple = string[]
