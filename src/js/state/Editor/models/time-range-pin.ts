import {TimeRangeQueryPin} from "../types"

export default class TimeRangePin {
  constructor(private pin: TimeRangeQueryPin) {}

  toZed() {
    return (
      "range " +
      this.pin.from.toISOString() +
      " to " +
      this.pin.to.toISOString()
    )
  }
}
