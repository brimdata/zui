/* @flow */

import Moment from "moment-timezone"

import type {EpochObj, TimeUnit} from "./"

const STORAGE_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS"

export const toStore = (date: Date) => Moment.utc(date).format(STORAGE_FORMAT)

export const fromStore = (string: string) =>
  Moment.utc(string, STORAGE_FORMAT, true).toDate()

export const moment = Moment

export const zones = Moment.tz.names

export const setZone = (zone: string) => Moment.tz.setDefault(zone)

export const toString = (date: Date) => Moment.utc(date).format(STORAGE_FORMAT)

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

export const parseFromBoom = ({sec, ns}: EpochObj): Date => {
  const millis = (sec + ns / 1e9) * 1e3
  return new Date(millis)
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
