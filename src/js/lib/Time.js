/* @flow */

/* Date functions that are aware of the global timezone

There are three important timeones:
  1. Host Timezone
     All native JS dates objects will be in this timezone.
  2. User Supplied Timezone
     Moment will use this timezone to format the date objects.
     This can be the same or different from the host timezone.
  3. UTC
     All dates will be stored in the redux store as UTC strings

This library only operates on native date objects or on strings.
Internally it uses the moment library, but does not expose moment
objects.

Set the user supplied timezone globally with:
    Time.setZone("US/Pacific")
When we store dates in the store, always use the UTC version of the
date.
    Time.toStore(date)
    Time.fromStore(string)
*/

import Moment from "moment-timezone"

export type TimeUnit =
  | "years"
  | "year"
  | "y"
  | "months"
  | "month"
  | "M"
  | "weeks"
  | "week"
  | "w"
  | "days"
  | "day"
  | "d"
  | "hours"
  | "hour"
  | "h"
  | "minutes"
  | "minute"
  | "m"
  | "seconds"
  | "second"
  | "s"
  | "milliseconds"
  | "millisecond"
  | "ms"

export type EpochObj = {sec: number, ns: number}

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
  const nanos = parseFloat(sec + "." + padZeros(ns.toString(), 9))
  const millis = parseInt(nanos * 1e3)
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

const padZeros = (string: string, desiredLength: number) => {
  while (string.length < desiredLength) string += "0"
  return string
}
