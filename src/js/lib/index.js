/* @flow */

import {isEmpty} from "lodash"

import {isArray} from "./is"
import animation from "./animation"
import date from "./date"
import doc from "./doc"
import file from "./file"
import keep from "./keep"
import obj from "./obj"
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
  date,
  on: (...args: *) => document.addEventListener(...args),
  off: (...args: *) => document.removeEventListener(...args),
  // $FlowFixMe Everytime I use filter it doesn't like it
  compact: (array: *[]) => array.filter((item) => !!item),
  bounded: (num: number, [from, to]: [number, number]) => {
    return Math.max(from, Math.min(num, to))
  }
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
