import * as d3 from "d3"
import brim from "src/js/brim"
import {zed} from "zealot"

export type FormatConfig = {
  thousands: string
}

export function formatPrimitive(
  data: zed.Primitive,
  config: Partial<FormatConfig> = {}
) {
  if (data.isUnset()) return "⦻"
  if (zed.isNamed(data.type, "port")) return data.toString()
  if (zed.isInt(data)) return formatInt(data.toInt(), config)
  if (zed.isTime(data)) return brim.time(data.toDate()).format()
  return data.toString()
}

export function formatInt(string: number, config: Partial<FormatConfig> = {}) {
  const locale = d3.formatLocale({
    decimal: ".",
    thousands: config.thousands || ",",
    grouping: [3],
    currency: ["", "$"],
    percent: "\u202f%"
  })
  return locale.format(",")(string)
}
