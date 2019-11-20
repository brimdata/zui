/* @flow */
import type {DateTuple} from "../lib/TimeWindow"
import type {SpanArgs, SpanItemArg} from "../state/search/types"
import {isString} from "../lib/is"
import brim, {type Span, type Ts} from "./"

export default function span(args: SpanArgs | Span) {
  let computed = compute()

  function computeArg(arg: SpanItemArg, now: Date = new Date()): Ts {
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
    }
  }
}
