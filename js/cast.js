import moment from "moment"

const BRO_TS_FORMAT = "X.SSSSSS"

export function toDate(string) {
  return moment.utc(string, BRO_TS_FORMAT).toDate()
}

export function toInt(string) {
  return parseInt(string)
}

export function toTs(date) {
  return moment.utc(date).format(BRO_TS_FORMAT)
}

export function toSec(date) {
  return moment.utc(date).unix()
}

export const toMoment = ({sec, ns}) => {
  return moment.utc(sec + "." + ns, BRO_TS_FORMAT)
}

export const fromNanoTsToDate = ts => new Date(ts / 1000000.0)

export const fromNanoTsToMoment = ts => moment.utc(fromNanoTsToDate(ts))
