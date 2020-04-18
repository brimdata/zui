/* @flow */

import {isEmpty} from "lodash"
import uniq from "lodash/uniq"

import {isArray} from "./is"
import animation from "./animation"
import date from "./date"
import doc from "./doc"
import file from "./file"
import keep from "./keep"
import obj from "./obj"
import open from "./open"
import transaction from "./transaction"
import win from "./win"

let array = {
  wrap(item: *) {
    if (isArray(item)) return item
    if (isEmpty(item)) return []
    return [item]
  }
}

export default {
  file,
  keep,
  obj,
  doc,
  win,
  array,
  animation,
  open,
  date,
  transaction,
  on: (...args: *) => document.addEventListener(...args),
  off: (...args: *) => document.removeEventListener(...args),
  // $FlowFixMe Everytime I use filter it doesn't like it
  compact: (array: *[]) => array.filter((item) => !!item),
  uniq,
  bounded: (num: number, [from, to]: [number, number]) => {
    return Math.max(from, Math.min(num, to))
  },
  move: <T>(array: T[], src: number, dest: number): T[] => {
    let copy = [...array]
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

export type TimeObj = {minutes: number, hours: number}

export type EpochObj = {sec: number, ns: number}
