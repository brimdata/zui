import moment from "moment-timezone"
import {TimeUnit} from "../lib"
import {isBigInt, isDate} from "../lib/is"
import {DateTuple} from "../lib/TimeWindow"
import brim, {Span, Ts} from "./"

function time(val: Ts | bigint | Date = new Date()) {
  let ts: Ts
  if (isBigInt(val)) {
    ts = fromBigInt(val)
  } else if (isDate(val)) {
    ts = dateToTs(val)
  } else {
    ts = val
  }

  return {
    toDate(): Date {
      return new Date((ts.sec + ts.ns / 1e9) * 1e3)
    },

    toFracSec() {
      return ts.sec + ts.ns / 1e9
    },

    toTs(): Ts {
      return ts
    },

    toBigInt(): bigint {
      return BigInt(ts.sec) * BigInt(1e9) + BigInt(ts.ns)
    },

    add(amount: number, unit: TimeUnit) {
      const ts = dateToTs(
        moment(this.toDate())
          .add(amount, unit)
          .toDate()
      )
      return brim.time(ts)
    },

    subtract(amount: number, unit: TimeUnit) {
      const ts = dateToTs(
        moment(this.toDate())
          .subtract(amount, unit)
          .toDate()
      )
      return brim.time(ts)
    },

    addTs(dur: Ts) {
      const added = this.toBigInt() + time(dur).toBigInt()
      return brim.time(added)
    },

    subTs(diff: Ts) {
      const dur = this.toBigInt().minus(time(diff).toBigInt())
      return brim.time(fromBigInt(dur))
    },

    format(fmt?: string, zone?: string) {
      return moment(this.toDate())
        .tz(zone || "UTC")
        .format(fmt || "YYYY-MM-DDTHH:mm:ss.SSS")
    }
  }
}

function fromBigInt(i: bigint): Ts {
  const sec = i / BigInt(1e9)
  const ns = i - sec * BigInt(1e9)
  return {sec: Number(sec), ns: Number(ns)}
}

function dateToTs(date: Date): Ts {
  const ms = date.getTime()
  const secFloat = ms / 1000
  const sec = Math.floor(secFloat)
  const ns = +(secFloat - sec).toFixed(3) * 1e9
  return {
    sec,
    ns
  }
}

time.setZone = function(name: string) {
  moment.tz.setDefault(name)
}

time.getZoneNames = function() {
  return moment.tz.names()
}

time.setDefaultFormat = function(format = "") {
  if (format) {
    moment.defaultFormat = format
    moment.defaultFormatUtc = format
  } else {
    moment.defaultFormat = "YYYY-MM-DDTHH:mm:ss.SSS"
    moment.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss.SSS"
  }
}

// Remove or move this later
time.convertToSpan = function(tw: DateTuple | null | undefined): Span | null {
  if (tw) {
    const [from, to] = tw
    return [brim.time(from).toTs(), brim.time(to).toTs()]
  } else {
    return null
  }
}

export default time
