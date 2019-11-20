/* @flow */

import type {$Field} from "../brim"
import type {$Menu} from "../electron/menu"
import type {SpanArgs} from "../state/search/types"
import type {TimeUnit} from "../lib"
import AppError from "../models/AppError"
import Log from "../models/Log"
import dimens from "../components/Dimens"

export type Notification =
  | AppError
  | {
      type: string,
      data: Object,
      key: string
    }

export type Column = {type: string, name: string}
export type Descriptor = Column[]
export type Descriptors = {[string]: Descriptor}
export type Tuple = string[]
export type Tuples = Tuple[]
export type TupleSet = {descriptors: Descriptors, tuples: Tuples}

export type ViewerDimens = {
  rowHeight: number,
  rowWidth: number | "auto",
  viewHeight: number,
  viewWidth: number,
  listHeight: number,
  listWidth: number | "auto"
}

export type RowRenderer = (index: number, dimens: ViewerDimens) => *

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

export type RightClickBuilder = ($Field, Log, boolean) => $Menu

export type Results = {
  tuples: Tuple[],
  descriptor: Descriptor
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
  spanArgs: SpanArgs,
  space: string
}
