/* @flow */

import type {EpochObj} from "../lib/Time"
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

export type ViewerDimens = {
  rowHeight: number,
  rowWidth: number | "auto",
  viewHeight: number,
  viewWidth: number,
  listHeight: number,
  listWidth: number | "auto"
}

export type RowRenderer = (index: number, dimens: ViewerDimens) => *

export type SearchResult = {
  type: "SearchResult",
  channel_id?: number,
  results: {
    tuples: Tuple[],
    descriptor: Descriptor
  }
}

export type SearchEnd = {
  type: "SearchEnd"
}

export type SearchStats = {
  type: "SearchStats",
  start_time: EpochObj,
  update_time: EpochObj,
  stats: {
    bytes_matched: number,
    bytes_read: number,
    tuples_matched: number,
    tuples_read: number
  }
}

export type Payload = SearchResult | SearchEnd | SearchStats
