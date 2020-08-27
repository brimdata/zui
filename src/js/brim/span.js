/* @flow */
import moment from "moment"

import type {DateTuple} from "../lib/TimeWindow"
import type {SpanArgs, TimeArg} from "../state/Search/types"
import {isString} from "../lib/is"
import brim, {type Span, type Ts} from "./"

export default function span(args: SpanArgs | Span) {
  let computed = compute()

  function computeArg(arg: TimeArg, now: Date = new Date()): Ts {
    if (isString(arg)) return brim.relTime(arg, now).toTs()
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
      return to - from
    },
    formatAgo() {
      let [from, to] = this.toDateTuple()
      return moment.duration(moment(to).diff(moment(from))).humanize()
    },
    shortFormat() {
      let [from, to] = this.toDateTuple()
      let diff = moment.duration(moment(to).diff(moment(from)))
      let ms = diff.asMilliseconds()
      let sec = diff.asSeconds()
      let min = diff.asMinutes()
      let hr = diff.asHours()
      let day = diff.asDays()
      let wk = diff.asWeeks()
      let mth = diff.asMonths()
      let yr = diff.asYears()
      let obj = {yr, mth, wk, day, hr, min, sec, ms}

      for (let [unit, amount] of Object.entries(obj)) {
        if (Number(amount) > 1) return `${parseInt(amount)} ${unit}`
      }
      return `${ms} ms`
    },
    isValid() {
      let [from, to] = this.toDateTuple()
      return to > from
    }
  }
}
