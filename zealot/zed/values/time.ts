import {
  convert,
  DateTimeFormatter,
  LocalDateTime,
  nativeJs
} from "@js-joda/core"
import {TypeTime} from "../types/type-time"
import {isNull} from "../utils"
import {Primitive} from "./primitive"

export class Time extends Primitive {
  type = TypeTime
  _time: LocalDateTime | null

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

  constructor(value) {
    super(value)
    this._time = isNull(value) ? null : Time.parse(value)
  }

  toDate() {
    if (isNull(this._time)) return null
    return convert(this._time).toDate()
  }
}

const parseEpochSec = (v) => {
  const d = new Date(+v * 1000)
  if (isNaN(d as any)) throw new Error("Not Epoch Seconds: " + v)
  return LocalDateTime.from(nativeJs(d))
}
const NanoFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss[.n]'Z'")
const parseNano = (v) => LocalDateTime.parse(v, NanoFormat)

const PARSERS = [parseNano, parseEpochSec]
