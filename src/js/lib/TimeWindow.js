import moment from "moment"
import isEqual from "lodash/isEqual"
import * as Time from "./Time"

export const duration = ([from, to], unit = "ms", integer = false) =>
  moment.duration(moment(to).diff(moment(from)), integer).as(unit)

export const humanDuration = ([from, to]) =>
  moment.duration(moment(to).diff(moment(from))).humanize()

export const inSameUnit = ([from, to], unit) =>
  isEqual(
    moment(from)
      .startOf(unit)
      .toDate(),
    moment(to)
      .startOf(unit)
      .toDate()
  )

export const floorAndCeil = ([from, to], unit) => [
  moment(from)
    .startOf(unit)
    .toDate(),
  moment(to)
    .endOf(unit)
    .toDate()
]

export const shift = (timeWindow, amount, unit = "ms") =>
  timeWindow.map(date => Time.add(date, amount, unit))
