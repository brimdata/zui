import {DateTuple} from "../lib/TimeWindow"
import {Ts} from "./span"
import time from "./time"

export default function dateTuple(dt: DateTuple) {
  return {
    toSpan(): [Ts, Ts] {
      return [time(dt[0]).toTs(), time(dt[1]).toTs()]
    },
  }
}
