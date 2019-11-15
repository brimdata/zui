/* @flow */

import Moment from "moment-timezone"

export const moment = Moment

export const format = (date: Date, format: string) =>
  Moment(date).format(format)
