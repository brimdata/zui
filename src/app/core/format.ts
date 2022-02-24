import {createSelector} from "@reduxjs/toolkit"
import * as d3 from "d3"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {State} from "src/js/state/types"
import {zed} from "@brimdata/zealot"
import {isString} from "lodash"

/**
 * Preferences object provided by the user.
 */
export type FormatConfig = {
  thousands: string
  timeZone: string
  timeFormat: string
  decimal: string
}

export const getFormatConfig = createSelector<State, any, FormatConfig>(
  ConfigPropValues.get("display"),
  (values) => ({
    thousands: values.thousandsSeparator,
    timeZone: values.timeZone,
    timeFormat: values.timeFormat,
    decimal: values.decimal
  })
)

const getTimeZone = createSelector<State, FormatConfig, string>(
  getFormatConfig,
  (config) => config.timeZone
)

export const useTimeZone = () => useSelector(getTimeZone)

export function formatPrimitive(
  data: zed.Primitive,
  config: Partial<FormatConfig> = {}
) {
  if (data.isUnset()) {
    return "⦻"
  }
  if (zed.isNamed(data.type, "port")) {
    return data.toString()
  }
  if (zed.isInt(data)) {
    return formatInt(Number(data.toInt()), config)
  }
  if (zed.isTime(data)) {
    return brim.time(data.toDate()).format(config.timeFormat, config.timeZone)
  }
  if (zed.isDuration(data)) {
    return replaceDecimal(data.toString(), config.decimal)
  }
  if (zed.isFloat64(data)) {
    return replaceDecimal(data.toString(), config.decimal)
  }

  return data.toString()
}

function getNumberLocale(config) {
  return d3.formatLocale({
    decimal: config.decimal || ".",
    thousands: config.thousands === undefined ? "," : config.thousands,
    grouping: [3],
    currency: ["", "$"],
    percent: "\u202f%"
  })
}

function replaceDecimal(string: string, replacement: string | undefined) {
  return isString(replacement) ? string.replace(/\./g, replacement) : string
}

function formatInt(string: number, config: Partial<FormatConfig> = {}) {
  const locale = getNumberLocale(config)
  // https://github.com/d3/d3-format
  return locale.format(",.0f")(string)
}

/**
 * Hook to be used in components. Subscribes to state
 * and will re-render the component if the format config
 * changes.
 *
 * @returns Format function for zed primitive data
 */
export function useZedFormatter() {
  const config = useSelector(getFormatConfig)

  return useMemo(() => (value) => formatPrimitive(value, config), [config])
}
