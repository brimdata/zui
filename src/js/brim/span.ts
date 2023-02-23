import moment from "moment"

import {DateTuple} from "../lib/TimeWindow"
import {isString} from "../lib/is"
import brim, {Span, Ts} from "./"
import {isDate} from "lodash"

export type TimeArg = string | Ts
export type SpanArgs = [TimeArg, TimeArg]

export default function span(args: SpanArgs | Span | [Date, Date]) {
  let computed = compute()

  function computeArg(arg: TimeArg | Date, now: Date = new Date()): Ts {
    if (isString(arg)) return brim.relTime(arg, now).toTs()
    else if (isDate(arg)) return brim.time(arg).toTs()
    else return arg
  }

  function compute(now: Date = new Date()): Span {
    return [computeArg(args[0], now), computeArg(args[1], now)]
  }

  return {
    recompute(now: Date = new Date()) {
      computed = compute(now)
      return this
    },
    toSpan(): Span {
      return computed
    },
    toDateTuple(): DateTuple {
      return [brim.time(computed[0]).toDate(), brim.time(computed[1]).toDate()]
    },
    getDuration() {
      const [from, to] = this.toDateTuple()
      return to.getTime() - from.getTime()
    },
    formatAgo() {
      const [from, to] = this.toDateTuple()
      return moment.duration(moment(to).diff(moment(from))).humanize()
    },
    shortFormat() {
      const [from, to] = this.toDateTuple()
      const diff = moment.duration(moment(to).diff(moment(from)))
      const ms = diff.asMilliseconds()
      const sec = diff.asSeconds()
      const min = diff.asMinutes()
      const hr = diff.asHours()
      const day = diff.asDays()
      const wk = diff.asWeeks()
      const mth = diff.asMonths()
      const yr = diff.asYears()
      const obj = {yr, mth, wk, day, hr, min, sec, ms}

      for (const [unit, amount] of Object.entries(obj)) {
        if (Number(amount) > 1) return `${parseInt(amount.toString())} ${unit}`
      }
      return `${ms} ms`
    },
    isValid() {
      const [from, to] = this.toDateTuple()
      return to > from
    },
  }
}
