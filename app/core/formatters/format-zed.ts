import * as d3 from "d3"
import brim from "src/js/brim"
import {zed} from "zealot"

export function formatPrimitive(data: zed.Primitive, config: object) {
  if (data.isUnset()) return "⦻"
  if (zed.isNamed(data.type, "port")) return data.toString()
  if (zed.isInt(data)) return formatInt(data.toString(), config)
  if (zed.isTime(data)) return brim.time(data.toDate()).format()
  return data.toString()
}

export function formatInt(string: string, config = {}) {
  const locale = d3.formatLocale({
    decimal: ".",
    thousands: config.thousandsSeparator || ",",
    grouping: [3],
    currency: ["", "$"],
    minus: "\u2212",
    percent: "\u202f%"
  })
  return locale.format(",")(string)
}
