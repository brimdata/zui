/* @flow */

import moment from "moment-timezone"

import type {$Ts} from "./"
import type {TimeUnit} from "../lib"

function time(val: $Ts | Date) {
  let date = convertToDate(val)

  return {
    toDate() {
      return date
    },

    toFracSec() {
      let ms = date.getTime()
      return ms / 1000
    },

    toTs(): $Ts {
      let ms = date.getTime()
      let secFloat = ms / 1000
      let sec = Math.floor(secFloat)
      let ns = +(secFloat - sec).toFixed(3) * 1e9
      return {
        sec,
        ns
      }
    },

    add(amount: number, unit: TimeUnit) {
      date = moment(date)
        .add(amount, unit)
        .toDate()
      return this
    },

    subtract(amount: number, unit: TimeUnit) {
      date = moment(date)
        .subtract(amount, unit)
        .toDate()
      return this
    },

    format(fmt: string) {
      return moment(date).format(fmt)
    }
  }
}

function convertToDate(val) {
  if (val instanceof Date) {
    return val
  }

  if ("ns" in val && "sec" in val) {
    return new Date((val.sec + val.ns / 1e9) * 1e3)
  }

  return new Date()
}

time.setZone = function(name: string) {
  moment.tz.setDefault(name)
}

time.getZoneNames = function() {
  return moment.tz.names()
}

export default time
