/* @flow */
import type {Space} from "../lib/Space"
import brim from "./"

export default function space(info: Space) {
  return {
    name() {
      return info.name
    },
    data() {
      return info
    },
    defaultSpanArgs() {
      let maxTime = brim.time(info.max_time)
      let oldData = new Date() - maxTime.toDate() > 1000 * 60 * 30
      if (oldData) {
        return [maxTime.subtract(30, "minutes").toTs(), info.max_time]
      } else {
        return ["now-30m", "now"]
      }
    },
    empty() {
      return (
        info.min_time.sec === 0 &&
        info.min_time.ns === 0 &&
        info.max_time.sec === 0 &&
        info.max_time.ns === 0
      )
    }
  }
}
