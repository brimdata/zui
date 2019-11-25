/* @flow */

import moment from "moment-timezone"

import type {DateTuple} from "../lib/TimeWindow"
import {type TimeUnit} from "../lib"
import {isDate} from "../lib/is"
import brim, {type Ts} from "./"

function time(val: Ts | Date = new Date()) {
  let ts = isDate(val) ? dateToTs(val) : val

  return {
    toDate() {
      return new Date((ts.sec + ts.ns / 1e9) * 1e3)
    },

    toFracSec() {
      return ts.sec + ts.ns / 1e9
    },

    toTs(): Ts {
      return ts
    },

    add(amount: number, unit: TimeUnit) {
      ts = dateToTs(
        moment(this.toDate())
          .add(amount, unit)
          .toDate()
      )
      return this
    },

    subtract(amount: number, unit: TimeUnit) {
      ts = dateToTs(
        moment(this.toDate())
          .subtract(amount, unit)
          .toDate()
      )
      return this
    },

    format(fmt: string) {
      return moment(this.toDate()).format(fmt)
    }
  }
}

function dateToTs(date: Date): Ts {
  let ms = date.getTime()
  let secFloat = ms / 1000
  let sec = Math.floor(secFloat)
  let ns = +(secFloat - sec).toFixed(3) * 1e9
  return {
    sec,
    ns
  }
}

time.setZone = function(name: string) {
  moment.tz.setDefault(name)
}

time.getZoneNames = function() {
  return moment.tz.names()
}

// Remove or move this later
time.convertToSpan = function(tw: ?DateTuple) {
  if (tw) {
    let [from, to] = tw
    return [brim.time(from).toTs(), brim.time(to).toTs()]
  } else {
    return null
  }
}

export default time
