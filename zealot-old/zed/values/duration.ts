import {TypeDuration} from "../types/type-duration"
import {isNull} from "../utils"
import {Primitive} from "./primitive"

export class Duration extends Primitive {
  type = TypeDuration
  _nanos: bigint | null

  constructor(value: string | null) {
    super(value)
    if (isNull(value)) {
      this._nanos = null
    } else {
      this._nanos = parseNanos(value)
    }
  }

  asSeconds() {
    if (isNull(this._nanos)) return null
    const millis = Number(this._nanos / BigInt(1e6))
    return millis / 1000
  }

  asNanos() {
    return this._nanos
  }
}

const parseRE = /([.0-9]+)(ns|us|ms|s|m|h|d|w|y)/g

export const Nanosecond = 1n
export const Microsecond = 1000n * Nanosecond
export const Millisecond = 1000n * Microsecond
export const Second = 1000n * Millisecond
export const Minute = 60n * Second
export const Hour = 60n * Minute
export const Day = 24n * Hour
export const Week = 7n * Day
export const Year = 365n * Day
const scale = {
  ns: Nanosecond,
  us: Microsecond,
  ms: Millisecond,
  s: Second,
  m: Minute,
  h: Hour,
  d: Day,
  w: Week,
  y: Year
}

function parseNanos(s: string) {
  if (s.length === 0) return 0n

  let negative = false
  if (s[0] === "-") {
    negative = true
    s = s.slice(1)
  }
  let matches = s.matchAll(parseRE)
  let d = 0n
  for (const match of matches) {
    if (match.length !== 3) throw new Error("Invalid Duration")
    const [_all, num, unitName] = match
    let unit = scale[unitName]
    if (num.includes(".")) {
      const parts = num.split(".")
      if (parts.length !== 2) throw new Error("Invalid Duration")
      let whole = parts[0]
      d += BigInt(whole) * unit
      let frac = parts[1]
      let extra = 0n
      for (let char of frac) {
        extra += BigInt(char) * unit
        unit /= 10n
      }
      d += (extra + 5n) / 10n
    } else {
      d += BigInt(num) * unit
    }
  }
  if (negative) {
    d *= -1n
  }
  return d
}
