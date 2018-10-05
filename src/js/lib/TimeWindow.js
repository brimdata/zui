/* @flow */

import moment from "moment"
import isEqual from "lodash/isEqual"
import * as Time from "./Time"
import type {TimeUnit} from "./Time"

export type TimeWindow = [Date, Date]

export const duration = (
  [from, to]: TimeWindow,
  unit: TimeUnit = "ms",
  integer: boolean = false
) => moment.duration(moment(to).diff(moment(from), "sec", integer)).as(unit)

export const humanDuration = ([from, to]: TimeWindow) =>
  moment.duration(moment(to).diff(moment(from))).humanize()

export const inSameUnit = ([from, to]: TimeWindow, unit: TimeUnit) =>
  isEqual(
    moment(from)
      .startOf(unit)
      .toDate(),
    moment(to)
      .startOf(unit)
      .toDate()
  )

export const floorAndCeil = ([from, to]: TimeWindow, unit: TimeUnit) => [
  moment(from)
    .startOf(unit)
    .toDate(),
  moment(to)
    .endOf(unit)
    .toDate()
]

export const shift = (
  timeWindow: TimeWindow,
  amount: number,
  unit: TimeUnit = "ms"
) => timeWindow.map(date => Time.add(date, amount, unit))
