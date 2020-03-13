/* @flow */

import isEqual from "lodash/isEqual"
import moment from "moment"

import type {TimeUnit} from "./"
import brim from "../brim"

export type DateTuple = [Date, Date]

export const duration = (
  [from, to]: DateTuple,
  unit: TimeUnit = "ms",
  integer: boolean = false
) => moment.duration(moment(to).diff(moment(from), "sec", integer)).as(unit)

export const humanDuration = ([from, to]: DateTuple) =>
  moment.duration(moment(to).diff(moment(from))).humanize()

export const inSameUnit = ([from, to]: DateTuple, unit: TimeUnit) =>
  isEqual(
    moment(from)
      .startOf(unit)
      .toDate(),
    moment(to)
      .startOf(unit)
      .toDate()
  )

export const floorAndCeil = ([from, to]: DateTuple, unit: TimeUnit) => [
  moment(from)
    .startOf(unit)
    .toDate(),
  moment(to)
    .endOf(unit)
    .toDate()
]

export const shift = (
  [from, to]: DateTuple,
  amount: number,
  unit: TimeUnit = "ms"
) => {
  return [
    brim
      .time(from)
      .add(amount, unit)
      .toDate(),
    brim
      .time(to)
      .add(amount, unit)
      .toDate()
  ]
}

export const spanOfLast = (
  number: number,
  unit: TimeUnit,
  now: Date = new Date()
) => {
  return [
    brim
      .time(now)
      .subtract(number, unit)
      .toDate(),
    now
  ]
}
