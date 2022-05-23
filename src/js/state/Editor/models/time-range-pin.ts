import {TimeRangeQueryPin} from "../types"

export default class TimeRangePin {
  constructor(private pin: TimeRangeQueryPin) {}

  empty() {
    return !this.pin.from && !this.pin.to
  }

  toZed() {
    return `${this.pin.field} >= ${this.pin.from} and ${this.pin.field} < ${this.pin.to}`
  }
}
