/* @flow */

import moment from "moment-timezone"

import type {EpochObj, TimeUnit} from "../lib"

function time(o: EpochObj) {
  let date = new Date((o.sec + o.ns / 1e9) * 1e3)

  return {
    toDate() {
      return date
    },

    toFracSec() {
      return o.sec + o.ns / 1e9
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
    }
  }
}

time.setZone = function(name: string) {
  moment.tz.setDefault(name)
}

time.getZoneNames = function() {
  return moment.tz.names()
}

export default time
