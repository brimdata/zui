/* @flow */
import type {DateTuple} from "../lib/TimeWindow"
import brim from "./"

export default function dateTuple(dt: DateTuple) {
  return {
    toSpanArgs() {
      return [brim.time(dt[0]).toTs(), brim.time(dt[1]).toTs()]
    }
  }
}
