import * as zed from "@brimdata/zed-js"
import {DataProps} from "./use-data-props"

const MAX_CARDINALITY = 40

export function validateDataProps(props: DataProps) {
  const {error, range, interval, timeField, colorField, data} = props
  if (props.isFetching) {
    return "Loading..."
  }
  if (error) {
    return error
  }
  if (!range || !interval) {
    return `No date range found with '${timeField}'.`
  }
  if (data.length === 0) {
    return "No data."
  }
  if (!hasTimeField(data)) {
    return `Field '${timeField}' did not return time values.`
  }
  if (!hasGroupField(data)) {
    return `Field '${colorField}' did not return any groups.`
  }
  if (hasHighCardinality(data, MAX_CARDINALITY)) {
    return `Field '${colorField}' returned too many unique values (>${MAX_CARDINALITY}).`
  }
  return null
}

function hasTimeField(data: zed.Record[]) {
  return data.some((r) => r.has("time", zed.TypeTime))
}

function hasGroupField(data: zed.Record[]) {
  return data.some((r) => r.has("group"))
}

function hasHighCardinality(data: zed.Record[], max: number) {
  const set = new Set()
  for (const record of data) {
    const key = record.get("group").toString()
    set.add(key)
    if (set.size > max) return true
  }
  return false
}
