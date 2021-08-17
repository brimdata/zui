import {
  ChronoField,
  convert,
  DateTimeFormatterBuilder,
  LocalDateTime,
  nativeJs,
  ZonedDateTime,
  ZoneId
} from "@js-joda/core"
import {TypeTime} from "../types/type-time"
import {isNull} from "../utils"
import {Primitive} from "./primitive"

export class Time extends Primitive {
  type = TypeTime
  _time: ZonedDateTime | null

  static parse(value: string) {
    let time
    for (const parse of PARSERS) {
      try {
        time = parse(value)
        break
      } catch (e) {
        continue
      }
    }
    if (!time) throw new Error("zed.Time couldn't parse: " + value)
    return time
  }

  constructor(value: string | null) {
    super(value)
    this._time = isNull(value) ? null : Time.parse(value)
  }

  toDate() {
    if (isNull(this._time)) return null
    return convert(this._time).toDate()
  }

  toBigInt(): bigint {
    if (isNull(this._time)) return 0n
    let secs = this._time.toEpochSecond()
    return BigInt(secs) * 1_000_000_000n + BigInt(this._time.nano())
  }
}

const parseEpochSec = (v: string) => {
  const d = new Date(+v * 1000)
  if (isNaN(d as any)) throw new Error("Not Epoch Seconds: " + v)
  return ZonedDateTime.from(nativeJs(d))
}

const NanoFormat = new DateTimeFormatterBuilder()
  .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
  .appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true)
  .appendLiteral("Z")
  .toFormatter()

const parseNano = (v: string) =>
  ZonedDateTime.of(LocalDateTime.parse(v, NanoFormat), ZoneId.of("UTC"))

const PARSERS = [parseNano, parseEpochSec]
