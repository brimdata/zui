import {TimeRangeQueryPin} from "../types"

export default class TimeRangePin {
  constructor(private pin: TimeRangeQueryPin) {}

  empty() {
    return !this.pin.from && !this.pin.to
  }

  toZed() {
    return (
      "range " +
      this.pin.from.toISOString() +
      " to " +
      this.pin.to.toISOString()
    )
  }
}
