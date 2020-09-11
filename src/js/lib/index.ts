import {isEmpty} from "lodash"
import uniq from "lodash/uniq"

import {isArray} from "./is"
import animation from "./animation"
import date from "./date"
import doc from "./doc"
import file from "./file"
import obj from "./obj"
import open from "./open"
import transaction from "./transaction"
import win from "./win"

const array = {
  wrap(item: any) {
    if (isArray(item)) return item
    if (isEmpty(item)) return []
    return [item]
  }
}

export default {
  file,
  obj,
  doc,
  win,
  array,
  animation,
  open,
  date,
  transaction,
  compact: (array: any[]) => array.filter((item) => !!item),
  uniq,
  bounded: (num: number, [from, to]: [number, number]) => {
    return Math.max(from, Math.min(num, to))
  },
  move: <T>(array: T[], src: number, dest: number): T[] => {
    const copy = [...array]
    copy.splice(dest, 0, copy.splice(src, 1)[0])
    return copy
  },
  sleep: (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
}

export type TimeUnit =
  | "years"
  | "year"
  | "y"
  | "months"
  | "month"
  | "M"
  | "weeks"
  | "week"
  | "w"
  | "days"
  | "day"
  | "d"
  | "hours"
  | "hour"
  | "h"
  | "minutes"
  | "minute"
  | "m"
  | "seconds"
  | "second"
  | "s"
  | "milliseconds"
  | "millisecond"
  | "ms"

export type TimeObj = {minutes: number; hours: number}

export type EpochObj = {sec: number; ns: number}
