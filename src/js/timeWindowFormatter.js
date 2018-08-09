// XXX I want to delete this file, not the right approach

import moment from "moment"

export function shortDateTimeRange(timeWindow, delimiter = " - ") {
  return timeWindow.map(shortDateTime).join(delimiter)
}

export function shortDateTime(date) {
  return shortDate(date) + ", " + shortTime(date)
}

export function shortDate(date) {
  if (date) return moment.utc(date).format("MMM D")
  else return null
}

export function longDate(date) {
  if (date) return moment.utc(date).format("MMM D, YYYY")
  else return null
}

export function shortTime(date) {
  if (date) return moment.utc(date).format("HH:mm")
  else return null
}

export function humanDuration(timeWindow) {
  const [from, to] = timeWindow
  return moment.duration(moment.utc(from).diff(moment.utc(to))).humanize()
}

export function dateTime(date) {
  return longDate(date) + ", " + shortTime(date)
}
