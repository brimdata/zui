import {createSelector} from "@reduxjs/toolkit"
import * as d3 from "d3"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {State} from "src/js/state/types"
import {zed} from "zealot"

/**
 * Preferences object provided by the user.
 */
export type FormatConfig = {
  thousands: string
  timeZone: string
  timeFormat: string
}

export const getFormatConfig = createSelector<State, any, FormatConfig>(
  ConfigPropValues.get("display"),
  (values) => ({
    thousands: values.thousandsSeparator,
    timeZone: values.timeZone,
    timeFormat: values.timeFormat
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
  if (data.isUnset()) return "⦻"
  if (zed.isNamed(data.type, "port")) return data.toString()
  if (zed.isInt(data)) return formatInt(data.toInt(), config)
  if (zed.isTime(data))
    return brim.time(data.toDate()).format(config.timeFormat, config.timeZone)
  return data.toString()
}

function formatInt(string: number, config: Partial<FormatConfig> = {}) {
  const locale = d3.formatLocale({
    decimal: ".",
    thousands: config.thousands === undefined ? "," : config.thousands,
    grouping: [3],
    currency: ["", "$"],
    percent: "\u202f%"
  })
  return locale.format(",")(string)
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
