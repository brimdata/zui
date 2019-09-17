/* @flow */
import type {Space} from "../lib/Space"

export default function space(info: Space) {
  return {
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
