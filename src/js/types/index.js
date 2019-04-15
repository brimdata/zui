/* @flow */

import type {EpochObj, TimeUnit} from "../lib/Time"
import type {RightClickAction} from "../rightclick/actions"
import type {SearchBar} from "../reducers/searchBar"
import type {Span} from "../BoomClient/types"
import AppError from "../models/AppError"
import Field from "../models/Field"
import Log from "../models/Log"

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

export type HashCorrelation = {
  name: "hash" | "tx" | "rx" | "md5",
  data: {tuples: Tuple[], descriptor: Descriptor}
}

export type UidCorrelation = {
  name: "uid",
  data: Tuple[]
}

export type BoomSearchStats = {
  updateTime: number,
  startTime: number,
  bytesMatched: number,
  bytesRead: number,
  tuplesMatched: number,
  tuplesRead: number
}

export type Correlation = HashCorrelation | UidCorrelation
export type LogCorrelations = {
  uid?: Tuple[],
  md5?: {tuples: Tuple[], descriptor: Descriptor},
  tx?: {tuples: Tuple[], descriptor: Descriptor},
  rx?: {tuples: Tuple[], descriptor: Descriptor}
}

export type RelatedLogs = {
  [string]: Log[]
}

export type RightClickBuilder = (Field, Log) => RightClickAction[]

export type Results = {
  tuples: Tuple[],
  descriptor: Descriptor
}

export type HistogramData = {
  data: {ts: Date, [string]: number}[],
  keys: string[],
  timeBinCount: number,
  interval: Interval
}

export type Interval = {
  number: number,
  unit: LongTimeUnit,
  roundingUnit: TimeUnit
}

export type LongTimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"

export type SearchRecord = {
  program: string,
  pins: string[],
  span: Span,
  space: string
}
