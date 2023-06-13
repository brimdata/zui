import moment from "moment"

import * as d3 from "d3"

export type Interval = {
  number: number
  unit: LongTimeUnit
  fn: d3.TimeInterval
}

export type LongTimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"

export const timeUnits = {
  millisecond: "ms",
  second: "s",
  minute: "m",
  hour: "h",
  day: "d",
  week: "w",
  year: "y",
}

const ms = 1
const sec = 1000 * ms
const min = 60 * sec
const hr = 60 * min
const day = 24 * hr

export function getInterval([from, to]: [Date, Date]): Interval {
  const duration = moment.duration(moment(to).diff(moment(from)))

  if (duration.asMinutes() <= 1)
    return {number: 100, unit: "millisecond", fn: d3.utcMillisecond.every(100)}

  if (duration.asMinutes() <= 3)
    return {number: 500, unit: "millisecond", fn: d3.utcMillisecond.every(500)}

  if (duration.asMinutes() <= 5)
    return {number: 1, unit: "second", fn: d3.utcMillisecond.every(1 * sec)}

  if (duration.asMinutes() <= 10)
    return {number: 10, unit: "second", fn: d3.utcMillisecond.every(10 * sec)}

  if (duration.asMinutes() <= 20)
    return {number: 20, unit: "second", fn: d3.utcMillisecond.every(20 * sec)}

  if (duration.asMinutes() <= 30)
    return {number: 30, unit: "second", fn: d3.utcMillisecond.every(30 * sec)}

  if (duration.asHours() <= 2)
    return {number: 1, unit: "minute", fn: d3.utcMillisecond.every(1 * min)}

  if (duration.asHours() <= 4)
    return {number: 5, unit: "minute", fn: d3.utcMillisecond.every(5 * min)}

  if (duration.asHours() <= 12)
    return {number: 15, unit: "minute", fn: d3.utcMillisecond.every(15 * min)}

  if (duration.asDays() <= 1)
    return {number: 30, unit: "minute", fn: d3.utcMillisecond.every(30 * min)}

  if (duration.asDays() <= 3)
    return {number: 1, unit: "hour", fn: d3.utcMillisecond.every(1 * hr)}

  if (duration.asDays() <= 14)
    return {number: 6, unit: "hour", fn: d3.utcMillisecond.every(6 * hr)}

  if (duration.asDays() <= 60)
    return {number: 12, unit: "hour", fn: d3.utcMillisecond.every(12 * hr)}

  if (duration.asDays() <= 120)
    return {number: 1, unit: "day", fn: d3.utcMillisecond.every(1 * day)}

  if (duration.asMonths() <= 12)
    return {number: 7, unit: "day", fn: d3.utcMillisecond.every(7 * day)}

  return {number: 30, unit: "day", fn: d3.utcMillisecond.every(30 * day)}
}
