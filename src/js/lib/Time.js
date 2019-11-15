/* @flow */

import Moment from "moment-timezone"

export const moment = Moment

export const format = (date: Date, format: string) =>
  Moment(date).format(format)

export const parse = (
  string: string,
  format: string,
  strict: boolean = true
): ?Date => {
  const m = Moment(string, format, strict)
  return m.isValid() ? m.toDate() : null
}
