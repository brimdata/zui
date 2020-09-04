

import moment from "moment-timezone";
import bigInt, { BigNumber } from "big-integer";

import { DateTuple } from "../lib/TimeWindow";
import { TimeUnit } from "../lib";
import { isDate } from "../lib/is";
import brim, { Ts } from "./";

function time(val: Ts | Date = new Date()) {
  let ts = isDate(val) ? dateToTs(val) : val;

  return {
    toDate() {
      return new Date((ts.sec + ts.ns / 1e9) * 1e3);
    },

    toFracSec() {
      return ts.sec + ts.ns / 1e9;
    },

    toTs(): Ts {
      return ts;
    },

    toBigInt(): BigNumber {
      return bigInt(ts.sec).times(1e9).plus(ts.ns);
    },

    add(amount: number, unit: TimeUnit) {
      let ts = dateToTs(moment(this.toDate()).add(amount, unit).toDate());
      return brim.time(ts);
    },

    subtract(amount: number, unit: TimeUnit) {
      let ts = dateToTs(moment(this.toDate()).subtract(amount, unit).toDate());
      return brim.time(ts);
    },

    addTs(dur: Ts) {
      let added = this.toBigInt().add(time(dur).toBigInt());
      return brim.time(fromBigInt(added));
    },

    subTs(diff: Ts) {
      let dur = this.toBigInt().minus(time(diff).toBigInt());
      return brim.time(fromBigInt(dur));
    },

    format(fmt: string | null | undefined) {
      return moment(this.toDate()).format(fmt);
    }
  };
}

function fromBigInt(i: BigNumber): Ts {
  let sec = i.over(1e9);
  let ns = i.minus(sec.times(1e9));
  return { sec: sec.toJSNumber(), ns: ns.toJSNumber() };
}

function dateToTs(date: Date): Ts {
  let ms = date.getTime();
  let secFloat = ms / 1000;
  let sec = Math.floor(secFloat);
  let ns = +(secFloat - sec).toFixed(3) * 1e9;
  return {
    sec,
    ns
  };
}

time.setZone = function (name: string) {
  moment.tz.setDefault(name);
};

time.getZoneNames = function () {
  return moment.tz.names();
};

time.setDefaultFormat = function (format = "") {
  if (format) {
    moment.defaultFormat = format;
    moment.defaultFormatUtc = format;
  } else {
    moment.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    moment.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
  }
};

// Remove or move this later
time.convertToSpan = function (tw: DateTuple | null | undefined) {
  if (tw) {
    let [from, to] = tw;
    return [brim.time(from).toTs(), brim.time(to).toTs()];
  } else {
    return null;
  }
};

export default time;