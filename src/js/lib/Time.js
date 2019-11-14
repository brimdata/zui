/* @flow */

import Moment from "moment-timezone"

import type {TimeUnit} from "./"

export const moment = Moment

export const zones = Moment.tz.names

export const setZone = (zone: string) => Moment.tz.setDefault(zone)

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

export const set = (date: Date, object: Object) =>
  Moment(date)
    .set(object)
    .toDate()

export const add = (date: Date, amount: number, unit: TimeUnit) =>
  Moment(date)
    .add(amount, unit)
    .toDate()

export const subtract = (date: Date, amount: number, unit: TimeUnit) =>
  Moment(date)
    .subtract(amount, unit)
    .toDate()

export const fakeZone = (date: Date) => {
  const obj = Moment(date).toObject()
  return new Date(
    obj.years,
    obj.months,
    obj.date,
    obj.hours,
    obj.minutes,
    obj.seconds,
    obj.milliseconds
  )
}

export const toObject = (date: Date) => Moment(date).toObject()

export const timeAgo = (date: Date) => Moment(date).fromNow()

export function boomTime({sec, ns}: {sec: number, ns: number}) {
  let flt = sec + ns / 1e9
  return flt
}
