
import chrono from "chrono-node";
import moment from "moment-timezone";

import brim from "../brim";

function date(d: Date, zone: string = "UTC") {
  return {
    zone(name: string) {
      zone = name;
      return this;
    },

    format(fmt: string) {
      return moment(d).tz(zone).format(fmt);
    }
  };
}

// Move this, add tests, refactor
date.parseInZone = (string, zone, ref) => {
  let pad = n => n < 10 ? `0${n}` : n;

  let tmp = chrono.strict.parseDate(string, ref);
  if (tmp) {
    let year = tmp.getFullYear();
    let month = pad(tmp.getMonth() + 1);
    let date = pad(tmp.getDate());
    let hour = pad(tmp.getHours());
    let mins = pad(tmp.getMinutes());
    let secs = pad(tmp.getSeconds());
    let ms = (tmp.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
    let offset = moment(tmp).tz(zone).format("Z");

    let str = [year, month, date, hour, mins, secs, ms, offset].join(" ");
    let fmt = "YYYY MM DD HH mm ss SSS Z";

    return brim.time(moment(str, fmt, true).toDate()).toTs();
  } else if (brim.relTime(string).isValid()) {
    return string;
  } else {
    if (/^\s*now.*/i.test(string)) return null;
    let d = chrono.casual.parseDate(string, ref);
    if (d) {
      return brim.time(d).toTs();
    } else {
      return null;
    }
  }
};

date.zoneNames = function () {
  return moment.tz.names();
};

export default date;