// XXX I want to delete this file, not the right approach

import * as Time from "./lib/Time"
import * as TimeWindow from "./lib/TimeWindow"

export function shortDateTimeRange(timeWindow, delimiter = " - ") {
  return timeWindow.map(shortDateTime).join(delimiter)
}

export function shortDateTime(date) {
  return shortDate(date) + ", " + shortTime(date)
}

export function shortDate(date) {
  if (date) return Time.format(date, "MMM D")
  else return null
}

export function longDate(date) {
  if (date) return Time.format(date, "MMM D, YYYY")
  else return null
}

export function shortTime(date) {
  if (date) return Time.format(date, "HH:mm")
  else return null
}

export function humanDuration(timeWindow) {
  return TimeWindow.humanDuration(timeWindow)
}

export function dateTime(date) {
  return longDate(date) + ", " + shortTime(date)
}
