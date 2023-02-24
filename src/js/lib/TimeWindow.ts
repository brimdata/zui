import isEqual from "lodash/isEqual"
import moment from "moment"
import time from "../brim/time"

import {TimeUnit} from "./"

export type DateTuple = [Date, Date]

export const duration = (
  [from, to]: DateTuple,
  unit: TimeUnit = "ms",
  integer = false
) => moment.duration(moment(to).diff(moment(from), "ms", integer)).as(unit)

export const humanDuration = ([from, to]: DateTuple) =>
  moment.duration(moment(to).diff(moment(from))).humanize()

export const inSameUnit = ([from, to]: DateTuple, unit: TimeUnit) =>
  isEqual(
    moment(from).startOf(unit).toDate(),
    moment(to).startOf(unit).toDate()
  )

export const floorAndCeil = ([from, to]: DateTuple, unit: TimeUnit) => [
  moment(from).startOf(unit).toDate(),
  moment(to).endOf(unit).toDate(),
]

export const shift = (
  [from, to]: DateTuple,
  amount: number,
  unit: TimeUnit = "ms"
): DateTuple => {
  return [
    time(from).add(amount, unit).toDate(),
    time(to).add(amount, unit).toDate(),
  ]
}
