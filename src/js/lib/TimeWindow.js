import moment from "moment"
import isEqual from "lodash/isEqual"

export const duration = ([from, to], unit = "ms") =>
  moment.duration(moment(to).diff(moment(from))).as(unit)

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
