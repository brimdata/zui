/* @flow */

import moment from "moment-timezone"

import type {EpochObj, TimeUnit} from "../lib"

function time(o: EpochObj) {
  let date = new Date((o.sec + o.ns / 1e9) * 1e3)

  return {
    toDate() {
      return date
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

export default time
